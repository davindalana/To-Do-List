# To Do List

Aplikasi to-do list sederhana berbasis web untuk mengelola tugas harian. Dibangun dengan HTML, CSS, dan JavaScript murni — tidak memerlukan instalasi atau build step apapun.

## Fitur

- **Tambah tugas** — ketik deskripsi lalu tekan tombol *Add* atau `Enter`
- **Tandai selesai** — klik checkbox pada tugas; teks akan dicoret sebagai penanda visual
- **Hapus tugas** — tombol hapus muncul saat kursor diarahkan ke tugas (hover/focus)
- **Filter tugas** — tampilkan semua tugas, hanya yang aktif, atau hanya yang sudah selesai
- **Penyimpanan persisten** — data tersimpan di `localStorage` sehingga tugas tidak hilang saat halaman di-refresh

## Cara Menjalankan

Tidak diperlukan instalasi apapun. Cukup buka file `index.html` langsung di browser.

```
buka index.html di browser
```

## Struktur File

```
/
├── index.html       # Markup utama aplikasi
├── style.css        # Semua styling (CSS custom properties, responsive)
└── app.js           # Logika aplikasi (localStorage, render, event handling)
```

## Teknologi

| Teknologi    | Keterangan                                      |
|--------------|-------------------------------------------------|
| HTML5        | Semantic elements (`<main>`, `<section>`, dll.) |
| CSS3         | Vanilla CSS, custom properties, mobile-first    |
| JavaScript   | ES6+, vanilla JS, tanpa framework atau bundler  |
| localStorage | Persistensi data di sisi klien                  |

## Tampilan & UX

- Layout satu halaman, lebar maksimal 600px, terpusat di layar
- Input dan tombol *Add* di bagian atas; daftar tugas di tengah; filter di bawah
- Tombol hapus hanya muncul saat hover atau focus — antarmuka tetap bersih
- Pesan *"Nothing to do. Add a task above."* ditampilkan saat daftar kosong
- Filter aktif ditandai dengan indikator visual (latar belakang berwarna)

## Aksesibilitas

- Semua elemen interaktif dapat dioperasikan hanya dengan keyboard
- Focus ring terlihat jelas pada setiap elemen yang difokus
- `aria-label` diterapkan pada tombol tanpa teks yang jelas
- Kontras warna minimum 4.5:1 untuk teks utama

## Batasan Tugas

Panjang maksimal deskripsi tugas adalah **500 karakter**. Tugas dengan deskripsi kosong tidak akan ditambahkan.
