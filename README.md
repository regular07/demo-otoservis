# Akdeniz Oto Bakım & Lastik Merkezi — demo site

Demosantia portfolyo demosu · **Basic paket** (tek sayfa) · sektör: oto servis / lastikçi.

**Canlı:** https://regular07.github.io/demo-otoservis/

> İşletme adı, adres, telefon ve fiyatlar **tamamen kurgusaldır**. Bu site
> gerçek bir müşteriye ait değildir; "biz böyle site yapıyoruz" demek yerine
> göstermek için hazırlanmıştır.

---

## Ne var içinde

| Bölüm | Ne yapıyor |
| --- | --- |
| Hero | Tek mesaj + iki CTA: ara / WhatsApp |
| Hakkımızda | Kısa tanıtım + 3 sayı (deneyim, usta, lift) |
| Hizmetler | İki grup halinde **fiyat aralıklı** hizmet tablosu |
| Marka uzmanlığı | Hangi araç tiplerinde çalışıldığı |
| Galeri | Fotoğrafsız — renk/desen blokları |
| Randevu şeridi | Basic pakette form yok; telefon tek kanal |
| Saatler & konum | Bugünü vurgular + "şu an açık mı" rozeti + Google Haritalar |
| İletişim | Adres, iki telefon, e-posta, hızlı butonlar |

Sabit WhatsApp + arama butonu her ekranda görünür.

---

## Çalıştırma

Derleme adımı yok. Herhangi bir statik sunucu yeter:

```bash
cd demo-otoservis
python3 -m http.server 8110
# http://localhost:8110
```

Dosyayı çift tıklayarak da açılır ama `file://` altında Google Haritalar
iframe'i bazı tarayıcılarda engellenir; sunucuyla açmak daha doğru.

---

## Teknik

- Bootstrap 5.3.3 + Bootstrap Icons (CDN), Google Fonts
- Saf JavaScript — `script.js` tek IIFE, npm paketi yok
- `index.html` · `style.css` · `script.js` · `robots.txt` · `sitemap.xml`
- SEO: benzersiz title/description, OG + Twitter Card, canonical,
  `AutoRepair` JSON-LD

**Palet:** antrasit `#181b1f` + turuncu `#ff6b1a`
**Tipografi:** başlık Barlow Condensed · gövde Inter

---

## Müşteri işine uyarlarken

**1. Telefon numaraları — en kritik adım.**
Demoda kullanılan numaraların son 6 hanesi bilerek sıfırdır
(`0535 300 00 00`, `0242 300 00 00`) ki demoyu gören biri butona bastığında
yabancı birini aramasın. Gerçek numarayla değiştirirken **hepsini** tara:

```bash
grep -rnE 'tel:\+?[0-9]+|wa\.me/[0-9]+|mailto:[^"]+' index.html
```

Görünen metindeki numara ile linkteki numara aynı olmalı.

**2. Çalışma saatleri iki yerde tanımlı.**
`index.html` içindeki `.hours-list` satırları ve `script.js` içindeki
`takvim` nesnesi (dakika cinsinden). Saat değişirse **ikisi birlikte**
güncellenmeli, yoksa "şu an açığız" rozeti yalan söyler.
JSON-LD'deki `openingHoursSpecification` da unutulmamalı.

**3. Görsel eklemek.**
Tasarım bilerek fotoğrafsız kuruldu. Fotoğraf koymak isterseniz:
`assets/img/hero.jpg` dosyasını ekleyin, `style.css` içinde `#hero`
kuralındaki `background-image` satırının sonuna `, url('assets/img/hero.jpg')`
ekleyin. Galeri blokları da aynı mantıkla fotoğrafa çevrilebilir.

**4. Yayın adresi.**
`canonical`, `og:url`, `og:image`, JSON-LD ve `sitemap.xml` içinde
`https://regular07.github.io/demo-otoservis/` geçiyor. Gerçek alan adıyla
toplu değiştirin.

---

Web tasarım: [Demosantia](https://regular07.github.io/demosantia/)
