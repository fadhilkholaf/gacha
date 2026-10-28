# FaunaHeaven — Fauna Discovery

FaunaHeaven adalah aplikasi edukasi dan koleksi satwa berbasis HTML, CSS, dan JavaScript. Aplikasi ini menggabungkan materi konservasi, course, kuis, EcoKuji, FaunaDex, misi harian, profil pengguna, dan leaderboard.

## Menjalankan aplikasi

Cara paling sederhana:

1. Buka file `index.html` di browser.
2. Pastikan folder `assets` berada di lokasi yang sama dengan `index.html`.
3. Untuk pengalaman yang lebih stabil, jalankan melalui Live Server di Visual Studio Code.

Tidak ada backend pada versi ini. Data akun, koin, progress course, tema, dan kode promo tersimpan di `localStorage` browser.

## Struktur file

```text
gacha/
├── index.html       # Struktur halaman dan komponen modal
├── style.css        # Seluruh tampilan dan responsive layout
├── app.js           # State, data, fungsi, event, dan logika aplikasi
├── assets/          # Gambar banner EcoKuji
└── README.md        # Dokumentasi proyek
```

## Penjelasan file utama

### `index.html`

Berisi struktur utama aplikasi, antara lain:

- Header dan navigasi tab.
- Beranda Fauna Discovery.
- Section EcoKuji, FaunaDex, leaderboard, misi, FAQ, profil, dan pengaturan.
- Modal login, dialog notifikasi, input dialog, detail course, dan ruang belajar.
- Pemanggilan file eksternal:

```html
<link rel="stylesheet" href="style.css">
<script src="app.js"></script>
```

### `style.css`

Berisi seluruh aturan tampilan aplikasi:

- Layout container dan card grid.
- Banner EcoKuji landscape 16:9.
- Sidebar EcoKuji.
- Card course dan ruang belajar.
- Modal serta dialog popup.
- Tombol show/hide password.
- Tema terang dan gelap melalui class `dark-theme`.
- Responsive layout untuk layar kecil.

### `app.js`

Berisi logika utama aplikasi. Fungsi telah diberi komentar JSDoc agar lebih mudah dijelaskan.

Kelompok fungsi penting:

- `bukaDialog()` dan `bukaInputDialog()` menangani popup aplikasi.
- `prosesLogin()` dan `prosesDaftar()` menangani autentikasi demo.
- `updateAuthUI()` mengubah tombol header menjadi profil setelah login.
- `setTheme()` dan `toggleTheme()` mengatur mode terang/gelap.
- `renderCourses()` menampilkan card katalog course.
- `bukaRuangBelajar()` membuka halaman materi course.
- `tandaiModulSelesai()` menyimpan progress dan memberikan reward course.
- `renderDaftarMateri()` menampilkan jurnal edukasi.
- `mulaiKuis()` dan `submitJawaban()` menjalankan kuis serta reward koin.
- `tarikKuji()` menjalankan sistem gacha EcoKuji.
- `renderEcoDex()` menampilkan koleksi satwa pengguna.
- `renderMisi()` menampilkan misi dan tantangan harian.

## Alur autentikasi

Pengunjung tetap dapat melihat katalog, materi, FAQ, dan informasi aplikasi sebagai guest. Login diperlukan untuk aksi yang menyimpan data, seperti:

- Mendaftar course.
- Membuka ruang belajar course.
- Mengerjakan kuis.
- Menarik EcoKuji.
- Mengelola koleksi dan mengirim hadiah.
- Mengedit profil.

Versi demo menyimpan akun di `localStorage` menggunakan key `faunahaven_accounts`.

## Alur course dan reward

1. Pengguna membuka card course di Beranda.
2. Pengguna membaca detail silabus.
3. Setelah login, pengguna menekan `Daftar Kursus`.
4. Tombol berubah menjadi `Buka Ruang Belajar`.
5. Materi dibaca melalui daftar modul di sidebar.
6. Setiap modul dapat ditandai selesai.
7. Setelah seluruh modul selesai, ruang belajar ditutup dan reward course diberikan.

Progress disimpan menggunakan key `faunahaven_course_progress`, sedangkan status reward disimpan menggunakan key `faunahaven_course_rewards`.

## Reward kuis

Reward kuis terdiri dari:

- `+100 🪙` untuk setiap jawaban benar.
- Bonus penyelesaian kuis.
- Bonus misi harian jika target jurnal terpenuhi.

## EcoKuji dan FaunaDex

EcoKuji menggunakan sistem fixed-pool. Setiap banner memiliki jumlah tiket dan daftar hadiah masing-masing. Hasil yang diperoleh dapat disimpan ke koleksi FaunaDex atau dikonversi jika merupakan duplikat.

Gambar banner diambil dari folder `assets`:

- `mamaliav2.jpeg`
- `aves.jpeg`
- `reptilv2.jpeg`
- `pisces.jpeg`
- `amphibia.jpeg`
- `invertebrate.jpeg`

## Kode promo demo

Kode promo dummy didefinisikan di `app.js` pada objek `dummyPromoCodes`. Kode tidak ditampilkan pada dialog redeem dan setiap kode hanya dapat digunakan satu kali per akun/browser.

## Cara menjelaskan proyek saat presentasi

Gunakan urutan berikut:

1. Jelaskan tujuan aplikasi sebagai platform edukasi konservasi.
2. Tunjukkan pemisahan struktur HTML, styling CSS, dan logika JavaScript.
3. Jelaskan bahwa guest dapat melihat konten, tetapi fitur CRUD dan progress memerlukan login.
4. Demonstrasikan pendaftaran course dan ruang belajar.
5. Tunjukkan progress modul dan reward setelah course selesai.
6. Demonstrasikan kuis, EcoKuji, dan koleksi FaunaDex.
7. Tunjukkan dark mode serta dialog popup pengganti alert browser.
8. Jelaskan bahwa `localStorage` digunakan sebagai penyimpanan sementara versi demo.

## Catatan pengembangan

Untuk versi produksi, aplikasi sebaiknya menggunakan:

- Backend dan database.
- Password hashing, bukan penyimpanan password biasa.
- Autentikasi server dan session yang aman.
- Validasi input di sisi server.
- API untuk course, reward, koleksi, dan leaderboard.
- Penyimpanan file assets melalui CDN atau object storage.
