import os
import xml.etree.ElementTree as ET
from datetime import datetime

BASE_URL = "https://www.boyntoy.com"
LOCAL_ROOT = "."  # Scripti çalıştırdığın klasör

urlset = ET.Element("urlset", {
    "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9"
})

def add_url(path, priority="0.8"):
    url = ET.SubElement(urlset, "url")
    loc = ET.SubElement(url, "loc")
    loc.text = f"{BASE_URL}/{path.replace(os.sep, '/')}"  # Windows yol ayracı düzeltmesi

    lastmod = ET.SubElement(url, "lastmod")
    lastmod.text = datetime.today().strftime('%Y-%m-%d')

    changefreq = ET.SubElement(url, "changefreq")
    changefreq.text = "weekly"

    priority_tag = ET.SubElement(url, "priority")
    priority_tag.text = priority

# Tüm alt klasörlerdeki .html dosyaları tara
for root, _, files in os.walk(LOCAL_ROOT):
    for file in files:
        if file.endswith(".html"):
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, LOCAL_ROOT)
            add_url(rel_path, "1.0" if rel_path == "index.html" else "0.7")

# sitemap.xml dosyasını yaz
tree = ET.ElementTree(urlset)
tree.write("sitemap.xml", encoding="utf-8", xml_declaration=True)

print("✅ sitemap.xml dosyası oluşturuldu.")
