# Teheccüd · Seher · Sabah Namazı Vakitleri — APK Üretim Rehberi

Bu klasör, Diyanet İşleri Başkanlığı verilerine dayalı bir PWA (Progressive Web App)
içerir. Aşağıdaki adımlarla **bedava** olarak APK üretebilir ve babanıza gönderebilirsiniz.

## Klasör İçeriği

```
Teheccüd-seher-vakti/
├── index.html              ← Ana sayfa
├── manifest.json           ← PWA tanım dosyası
├── service-worker.js       ← Offline / cache
├── icons/                  ← Uygulama ikonları (192, 512, maskable)
└── KURULUM.md              ← Bu dosya
```

---

## 1. Adım — GitHub Hesabı

Eğer hesabınız yoksa: <https://github.com/signup> üzerinden ücretsiz açın.

## 2. Adım — Yeni Repo

1. <https://github.com/new> sayfasına gidin.
2. **Repository name:** `teheccud-vakit` (veya istediğiniz bir isim — küçük harf, tire kullanın).
3. **Public** olarak işaretleyin. (Private de olur ama Pages için Public daha basit.)
4. "Create repository" → yeni repo açıldı.

## 3. Adım — Dosyaları Yükleyin

En kolay yol: web arayüzünden sürükle bırak.

1. Yeni açılan repo sayfasında "**uploading an existing file**" linkine tıklayın.
2. Bu klasördeki **tüm içeriği** (`index.html`, `manifest.json`, `service-worker.js`, `icons/` klasörü) seçip sürükleyin.
3. Alttaki "Commit changes" düğmesine basın.

> Komut satırı isterseniz:
> ```bash
> cd "Teheccüd-seher-vakti"
> git init
> git add .
> git commit -m "İlk yükleme"
> git branch -M main
> git remote add origin https://github.com/KULLANICI_ADINIZ/teheccud-vakit.git
> git push -u origin main
> ```

## 4. Adım — GitHub Pages'i Açın

1. Repo sayfasında üst menüden **Settings** → sol menüden **Pages**.
2. **Source** kısmında "Deploy from a branch" seçin.
3. **Branch:** `main`, **Folder:** `/ (root)` seçip **Save**.
4. ~1 dakika sonra sayfa şu URL'i gösterir:
   ```
   https://KULLANICI_ADINIZ.github.io/teheccud-vakit/
   ```
5. Bu URL'i bir tarayıcıda açıp uygulamanın çalıştığını **kesinlikle** doğrulayın.

## 5. Adım — APK Üretin

1. <https://www.pwabuilder.com/> sayfasına gidin.
2. URL kutusuna 4. adımdaki Pages adresini yapıştırın → **Start** düğmesi.
3. PWABuilder PWA'nızı analiz eder. Kırmızı/yeşil işaretlerle skor verir; manifest, service worker ve security için yeşil görmelisiniz.
4. Sağ üstte **Package For Stores** düğmesine basın.
5. **Android** sekmesini seçin.
6. **Package Type: Signed APK** (test için yeterli) veya **Open Testing** seçeneklerini görürsünüz. Sadece babanıza göndereceksiniz, **APK** seçin.
7. Form doldurun:
   - **Package ID:** `com.kullaniciadi.vakit` (Türkçe karakter olmasın; bir kez belirleyin, sonra değiştirmeyin)
   - **App name:** `Vakit` veya istediğiniz isim
   - Diğer alanlar otomatik gelir.
8. **Generate** → birkaç saniye sonra `.zip` indirilir.
9. ZIP'in içinde **`app-release-signed.apk`** dosyası olur. Onu çıkartın.

## 6. Adım — Babanıza Gönderme & Kurulum

1. APK dosyasını WhatsApp, e-posta vs. ile babanıza yollayın.
2. Babanız:
   - APK'yı telefonda açar.
   - Android "Bilinmeyen kaynaklardan uygulama kuruluyor" uyarısı gösterir → **İzin Ver** der.
   - Kurulum tamamlanır, ana ekranda **Vakit** simgesi belirir.
3. Uygulamayı ilk açışta **il** ve **ilçe** seçer. Seçim hatırlanır; bir daha sormaz.
4. Vakitler her gün otomatik olarak Diyanet verilerinden güncellenir.

---

## Sık Sorulanlar

**Soru: APK ücretsiz mi?**
Evet, hem GitHub Pages hem PWABuilder ücretsizdir. Google Play Store'a yüklemek isterseniz orada bir kerelik 25 $ geliştirici ücreti vardır — gerek yok.

**Soru: İçeriği değiştirirsem APK'yı yeniden mi vermem gerekir?**
Hayır. İçerik web'de yaşıyor. `index.html`'i güncelleyip GitHub'a push ettiğinizde uygulamayı bir sonraki açışta babanız yeni sürümü görür. APK'yı sadece icon/isim/manifest değiştirirseniz yeniden üretirsiniz.

**Soru: Offline çalışıyor mu?**
Evet. İlk başarılı açılıştan sonra service worker hem statik dosyaları hem en son alınan vakitleri cache'ler. Babanız sinyali olmadığında bile son alınan vakitleri görür.

**Soru: PWABuilder yerine ücretsiz online APK çıkartan başka bir araç var mı?**
Evet, **Bubblewrap** (PWABuilder'ın altta kullandığı şey) ve **Capacitor** da olur ama her ikisi de bilgisayara yazılım kurmayı gerektirir. PWABuilder online çalıştığı için en pratik olanı.

---

## Lokal Test (İsteğe Bağlı)

GitHub'a göndermeden önce yerel olarak test etmek isterseniz:

```bash
cd "Teheccüd-seher-vakti"
python3 -m http.server 8765
```

Sonra tarayıcıda <http://127.0.0.1:8765/> adresini açın. (Service worker `file://` üzerinden çalışmaz, yerel sunucu şart.)
