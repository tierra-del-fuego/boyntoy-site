import requests
import json
import re

SHEET_ID = "122nNrYsH7mPXPci6Ks8Ree-Cg5hOsdHttOsebX5gm3A"
URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json"

response = requests.get(URL)
text = response.text

# Google Sheet verisini JSON formatına dönüştür
json_text = re.search(r"google\.visualization\.Query\.setResponse\((.+)\);", text).group(1)
data = json.loads(json_text)

rows = data["table"]["rows"]
columns = [col["label"] for col in data["table"]["cols"]]

# HTML başlangıç
html = """<html>
<head>
    <meta charset="utf-8">
    <title>Ürünler - Boyntoy</title>
    <meta name="description" content="eBay ürünleri: marka, fiyat ve bağlantı bilgileri.">
</head>
<body>
    <h1>Ürünler</h1>
"""

# Her ürün için HTML bloğu
for row in rows:
    values = [cell.get("v", "") if cell else "" for cell in row["c"]]
    item = dict(zip(columns, values))
    html += f"""
    <div class="product">
        <h2>{item.get('Name', '')}</h2>
        <p>Marka: {item.get('Brand', '')}</p>
        <p>Fiyat: {item.get('Price', '')}</p>
        <p><a href="{item.get('eBay Link', '')}" target="_blank">eBay'de Gör</a></p>
    </div>
    <hr>
    """

html += "</body></html>"

# HTML dosyasını kaydet
with open("products.html", "w", encoding="utf-8") as f:
    f.write(html)
