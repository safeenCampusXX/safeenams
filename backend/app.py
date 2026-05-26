import os
import uuid
from datetime import datetime
from io import BytesIO

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "campusxx")

API_CORS_ORIGINS = os.getenv("API_CORS_ORIGINS", "*")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    # Allows `python app.py --help` and basic import checks without env vars.
    # When running in prod, set Supabase env vars.
    print("[CampusXX] Warning: Missing SUPABASE_URL or SUPABASE_ANON_KEY; endpoints will fail until env vars are set.")


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": API_CORS_ORIGINS}})

supabase_anon = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
# For inserts/deletes from backend
if not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Missing SUPABASE_SERVICE_ROLE_KEY")
supabase_admin = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def parse_price(value):
    if value is None or str(value).strip() == "":
        raise ValueError("price is required")
    return float(value)


def now_iso():
    return datetime.utcnow().isoformat() + "Z"


def public_image_url(object_path: str) -> str:
    # Public buckets are accessible via: https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
    # Your project ref is embedded in SUPABASE_URL.
    # Example: https://xxxx.supabase.co
    base = SUPABASE_URL.rstrip("/")
    return f"{base}/storage/v1/object/public/{SUPABASE_BUCKET}/{object_path}"


def upload_image_to_supabase(file_storage) -> str:
    # file_storage is Werkzeug FileStorage
    filename = file_storage.filename or "upload"
    ext = os.path.splitext(filename)[1].lower() or ".jpg"
    object_path = f"products/{uuid.uuid4().hex}{ext}"

    # Basic image normalization (optional but helps reduce broken previews)
    content = file_storage.read()
    img = Image.open(BytesIO(content))
    img_format = "JPEG" if ext in [".jpg", ".jpeg", ".jfif", ""] else img.format

    buf = BytesIO()
    if img_format == "PNG":
        img.save(buf, format="PNG")
        content_bytes = buf.getvalue()
        upload_ext = ".png"
    else:
        img = img.convert("RGB")
        img.save(buf, format="JPEG", quality=85)
        content_bytes = buf.getvalue()
        upload_ext = ".jpg"

    object_path = f"products/{uuid.uuid4().hex}{upload_ext}"

    supabase_admin.storage.from_(SUPABASE_BUCKET).upload(
        file=content_bytes,
        path=object_path,
        file_options={"content-type": "image/png" if upload_ext == ".png" else "image/jpeg"},
    )

    return public_image_url(object_path)


@app.get("/api/books")
def get_books():
    res = supabase_anon.table("books").select("*").order("created_at", desc=True).execute()
    return jsonify(res.data or [])


@app.get("/api/notes")
def get_notes():
    res = supabase_anon.table("notes").select("*").order("created_at", desc=True).execute()
    return jsonify(res.data or [])


@app.get("/api/devices")
def get_devices():
    res = supabase_anon.table("devices").select("*").order("created_at", desc=True).execute()
    return jsonify(res.data or [])


@app.post("/api/upload-image")
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "Missing image file"}), 400

    image_file = request.files["image"]
    if not image_file.filename:
        return jsonify({"error": "Empty image filename"}), 400

    try:
        image_url = upload_image_to_supabase(image_file)
        return jsonify({"image_url": image_url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.post("/api/products/add")
def add_product():
    data = request.form.to_dict() if request.form else request.get_json(silent=True) or {}

    category = (data.get("category") or "").strip().lower()
    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()
    seller_name = (data.get("seller_name") or "").strip()
    contact = (data.get("contact") or "").strip()

    try:
        price = parse_price(data.get("price"))
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    # image_url: accept either direct image_url (from prior upload) or handle upload here
    image_url = None
    if request.files and "image" in request.files and request.files["image"].filename:
        image_url = upload_image_to_supabase(request.files["image"])
    else:
        image_url = (data.get("image_url") or "").strip() or None

    if category not in {"book", "books", "note", "notes", "device", "devices"}:
        return jsonify({"error": "Invalid category"}), 400

    table_map = {
        "book": "books",
        "books": "books",
        "note": "notes",
        "notes": "notes",
        "device": "devices",
        "devices": "devices",
    }
    table = table_map[category]

    required_common = [title, description, seller_name, contact]
    if any(not v for v in required_common):
        return jsonify({"error": "title, description, seller_name, contact are required"}), 400

    payload = {
        "title": title,
        "description": description,
        "price": price,
        "image_url": image_url,
        "seller_name": seller_name,
        "contact": contact,
    }

    if table == "notes":
        subject_name = (data.get("subject_name") or "").strip()
        notes_type = (data.get("notes_type") or "").strip()
        semester = (data.get("semester") or "").strip()
        if not subject_name or not notes_type or not semester:
            return jsonify({"error": "subject_name, notes_type, semester are required for notes"}), 400
        payload.update({
            "subject_name": subject_name,
            "notes_type": notes_type,
            "semester": semester,
        })

    if table == "devices":
        device_type = (data.get("device_type") or "").strip()
        condition = (data.get("condition") or "").strip()
        if not device_type or not condition:
            return jsonify({"error": "device_type and condition are required for devices"}), 400
        payload.update({
            "device_type": device_type,
            "condition": condition,
        })

    try:
        insert_res = supabase_admin.table(table).insert(payload).execute()
        # insert_res.data is list
        row = (insert_res.data or [None])[0]
        return jsonify({"success": True, "data": row}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.delete("/api/products/<product_type>/<product_id>")
def delete_product(product_type, product_id):
    product_type = product_type.strip().lower()
    table_map = {
        "books": "books",
        "notes": "notes",
        "devices": "devices",
    }
    if product_type not in table_map:
        return jsonify({"error": "Invalid product type"}), 400

    try:
        supabase_admin.table(table_map[product_type]).delete().eq("id", product_id).execute()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.get("/api/health")
def health():
    return jsonify({"ok": True, "time": now_iso()})


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)

