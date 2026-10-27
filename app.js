let currentKuisIndex = 0;
        let skorKuis = 0;
        let koin = 5000;
        let koleksi = [];
        let currentUser = localStorage.getItem('faunahaven_user') || null;
        let isAuthenticated = Boolean(currentUser);
        let registeredUsers = JSON.parse(localStorage.getItem('faunahaven_accounts') || '[]');
        let modulSaatIni = 0;
        let questProgress = 0;
        let questClaimed = false;
        let hasilGacha10x = [];
        let pendingLastOne = null;
        let kartuTahan = null;
        let courseRewardsClaimed = JSON.parse(localStorage.getItem('faunahaven_course_rewards') || '{}');
        let dialogInputCallback = null;

        function bukaDialog(title, message) {
            if (message === undefined) {
                message = title;
                title = 'FaunaHeaven';
            }
            const modal = document.getElementById('modalAppDialog');
            if (!modal) return;
            document.getElementById('appDialogTitle').innerText = title;
            document.getElementById('appDialogMessage').innerText = message;
            modal.style.display = 'flex';
        }

        function tutupDialog() {
            const modal = document.getElementById('modalAppDialog');
            if (modal) modal.style.display = 'none';
        }

        function bukaInputDialog(title, message, placeholder, callback) {
            dialogInputCallback = callback;
            document.getElementById('inputDialogTitle').innerText = title;
            document.getElementById('inputDialogMessage').innerText = message;
            const input = document.getElementById('inputDialogValue');
            input.value = '';
            input.placeholder = placeholder || '';
            document.getElementById('modalInputDialog').style.display = 'flex';
            setTimeout(() => input.focus(), 0);
        }

        function submitInputDialog() {
            const callback = dialogInputCallback;
            const value = document.getElementById('inputDialogValue').value.trim();
            tutupInputDialog();
            if (callback) callback(value);
        }

        function tutupInputDialog() {
            document.getElementById('modalInputDialog').style.display = 'none';
            dialogInputCallback = null;
        }

        const rarityWeight = { 'MUR': 6, 'UR': 5, 'SSR': 4, 'SR': 3, 'R': 2, 'N': 1 };

        let dbPeringkat = [
            { id: 1, nama: "ProEco_99", avatar: "👨‍🔬", koleksiUnik: 32, koin: 15400 },
            { id: 2, nama: "SatwaLover", avatar: "👩‍🌾", koleksiUnik: 28, koin: 8400 },
            { id: 3, nama: "RimbaRaya", avatar: "🏕️", koleksiUnik: 15, koin: 3200 },
            { id: 4, nama: "OceanGuardian", avatar: "🤿", koleksiUnik: 12, koin: 2100 },
            { id: "me", nama: "SisfoStudent (Kamu)", avatar: "🎓", koleksiUnik: 0, koin: 5000 }
        ];

        // DB JURNAL EDUKASI MENDALAM (12 MATERI DENGAN 3 SOAL)
        const modulEdukasi = [
            // MAMALIA
            { kategori: "mamalia", icon: "🦏", judul: "Biologi Badak Jawa (UR Mamalia)", deskripsi: "Mamalia terlangka di dunia dari Ujung Kulon.", 
              materi: `<h4>Biologi & Perilaku</h4><p>Badak Jawa (<em>Rhinoceros sondaicus</em>) merupakan mamalia besar yang sangat pemalu. Jantan memiliki satu cula kecil, sementara betina seringkali tidak memiliki cula sama sekali.</p><h4>Dinamika Habitat</h4><p>Satu-satunya habitat liar mereka yang tersisa adalah Taman Nasional Ujung Kulon. Badak Jawa membutuhkan area berlumpur untuk berkubang guna mengatur suhu tubuh dan menghindari parasit.</p><h4>Ancaman Ekstrem</h4><p>Ancaman terbesar saat ini bukan lagi perburuan, melainkan bencana alam (letusan Anak Krakatau) dan penyebaran penyakit dari ternak liar karena populasinya terpusat di satu titik rawan tsunami.</p>`, 
              kuis: [
                  { pertanyaan: "Di mana satu-satunya habitat liar Badak Jawa saat ini?", opsi: ["Taman Nasional Komodo", "Taman Nasional Ujung Kulon", "Hutan Lindung Gunung Leuser", "Sabana Baluran"], jawabanBenar: 1 },
                  { pertanyaan: "Apa ciri fisik utama yang membedakan Badak Jawa dengan Badak Sumatra?", opsi: ["Badak Jawa memiliki satu cula", "Badak Jawa berwarna putih", "Badak Jawa tidak bisa berenang", "Badak Jawa memakan daging"], jawabanBenar: 0 },
                  { pertanyaan: "Mengapa letusan Anak Krakatau sangat mengancam eksistensi Badak Jawa?", opsi: ["Karena abunya meracuni air", "Karena mereka sangat takut suara keras", "Karena habitat mereka berada persis di zona rawan tsunami", "Karena abu vulkanik menghancurkan cula mereka"], jawabanBenar: 2 }
              ] 
            },
            { kategori: "mamalia", icon: "🐋", judul: "Paus Biru Sang Raksasa (MUR Mamalia)", deskripsi: "Hewan terbesar yang pernah hidup di planet Bumi.", 
              materi: `<h4>Anatomi Raksasa</h4><p>Paus Biru (<em>Balaenoptera musculus</em>) bisa mencapai panjang 30 meter. Meskipun sangat besar, makanan utama mereka adalah krill (zooplankton kecil) yang mereka saring menggunakan struktur pelat di mulut bernama <em>baleen</em>.</p><h4>Whale Pump</h4><p>Paus Biru memainkan peran penting bernama "Whale Pump". Mereka makan di kedalaman laut lalu naik ke permukaan untuk bernapas dan membuang kotoran. Kotoran ini mengembalikan nutrisi penting (seperti besi dan nitrogen) ke permukaan untuk menyuburkan fitoplankton.</p><h4>Ancaman Modern</h4><p>Mereka terancam oleh polusi suara dari sonar militer dan mesin kapal laut yang mengganggu sistem ekolokasi (navigasi) mereka, serta insiden <em>ship strike</em> (tertabrak kapal niaga).</p>`, 
              kuis: [
                  { pertanyaan: "Bagaimana cara Paus Biru menyaring makanan berukuran sangat kecil dari air laut?", opsi: ["Menggunakan gigi setajam hiu", "Menggunakan pelat baleen di mulutnya", "Menyedot menggunakan hidungnya", "Menggunakan lendir di lidahnya"], jawabanBenar: 1 },
                  { pertanyaan: "Apa yang dimaksud dengan peran ekologis 'Whale Pump'?", opsi: ["Memompa air untuk bernapas", "Menghancurkan terumbu karang mati", "Mengembalikan nutrisi dasar laut ke permukaan melalui kotorannya", "Mendorong kapal nelayan menjauh"], jawabanBenar: 2 },
                  { pertanyaan: "Apa ancaman terbesar bagi sistem navigasi paus di era lautan modern?", opsi: ["Polusi limbah plastik", "Peningkatan jumlah ubur-ubur", "Polusi suara dari sonar dan mesin kapal", "Perubahan salinitas air laut"], jawabanBenar: 2 }
              ] 
            },
            // AVES
            { kategori: "aves", icon: "🕊️", judul: "Jalak Bali: Mutiara Pulau Dewata (UR Aves)", deskripsi: "Burung putih menawan yang menjadi maskot Provinsi Bali.", 
              materi: `<h4>Identifikasi Visual</h4><p>Jalak Bali (<em>Leucopsar rothschildi</em>) sangat mudah dikenali dari bulunya yang putih salju bersih, ujung sayap hitam, dan kulit tanpa bulu berwarna biru cerah di sekitar matanya.</p><h4>Peran Ekologis</h4><p>Sebagai burung pengicau dan pemakan serangga serta buah, mereka membantu penyerbukan dan pengendalian populasi serangga di hutan musim Bali Barat.</p><h4>Ancaman Kepunahan</h4><p>Kecantikannya membuat Jalak Bali menjadi target utama perburuan liar untuk perdagangan burung kicau ilegal pada tahun 90-an, hingga populasinya di alam liar pernah tersisa belasan ekor saja.</p>`, 
              kuis: [
                  { pertanyaan: "Warna dominan apa yang menutupi tubuh Jalak Bali?", opsi: ["Kuning keemasan", "Putih bersih seperti salju", "Hitam pekat", "Biru laut"], jawabanBenar: 1 },
                  { pertanyaan: "Apa alasan utama populasi Jalak Bali sempat berada di ambang kepunahan total?", opsi: ["Perburuan liar untuk perdagangan burung hias", "Kehabisan sumber makanan", "Diserang oleh elang", "Keracunan pestisida pertanian"], jawabanBenar: 0 },
                  { pertanyaan: "Di taman nasional manakah burung ini dilepasliarkan dan dilindungi ketat?", opsi: ["TN Baluran", "TN Bali Barat", "TN Alas Purwo", "TN Bromo Tengger Semeru"], jawabanBenar: 1 }
              ] 
            },
            { kategori: "aves", icon: "🦚", judul: "Tarian Surga Cendrawasih (MUR Aves)", deskripsi: "Burung surga Papua dengan ritual kawin yang luar biasa.", 
              materi: `<h4>Dimorfisme Seksual</h4><p>Burung Cendrawasih memiliki <em>dimorfisme seksual</em> ekstrem: pejantan memiliki bulu hiasan yang sangat panjang dan warna-warni memukau, sedangkan betinanya berwarna cokelat kusam agar bisa bersembunyi saat mengerami telur.</p><h4>Ritual Tarian</h4><p>Pejantan melakukan ritual tarian rumit di atas dahan pohon (arena) untuk memamerkan bulunya dan memikat betina. Evolusi ini terjadi karena di hutan Papua mereka tidak memiliki banyak predator alami.</p><h4>Fungsi Hutan & Ancaman</h4><p>Mereka memakan buah-buahan hutan dan mendistribusikan bijinya melintasi pegunungan Papua. Penebangan hutan dan perburuan liar untuk hiasan topi adalah ancaman utama mereka.</p>`, 
              kuis: [
                  { pertanyaan: "Mengapa burung Cendrawasih betina berevolusi memiliki warna yang kusam?", opsi: ["Karena mereka kurang makan", "Untuk kamuflase saat mengerami telur dari pemangsa", "Karena mereka tidak suka sinar matahari", "Agar bisa berbaur dengan burung gereja"], jawabanBenar: 1 },
                  { pertanyaan: "Apa tujuan pejantan melakukan tarian rumit sambil memamerkan bulunya?", opsi: ["Menakuti predator", "Berkomunikasi dengan spesies lain", "Menarik perhatian betina untuk kawin", "Membersihkan kutu dari sayapnya"], jawabanBenar: 2 },
                  { pertanyaan: "Apa kontribusi ekologis utama Cendrawasih di hutan hujan Papua?", opsi: ["Menjadi predator serangga", "Membersihkan bangkai hewan", "Menyebarkan biji buah-buahan hutan", "Menggali lubang untuk air"], jawabanBenar: 2 }
              ] 
            },
            // REPTILIA
            { kategori: "reptilia", icon: "🐢", judul: "Penyu Sisik: Tukang Kebun Karang (UR Reptilia)", deskripsi: "Reptil laut yang menjaga terumbu karang dari invasi spons.", 
              materi: `<h4>Biologi & Diet</h4><p>Penyu Sisik (<em>Eretmochelys imbricata</em>) memiliki paruh melengkung tajam mirip burung elang. Bentuk paruh ini berevolusi untuk mencongkel spons laut beracun dari celah terumbu karang.</p><h4>Peran Tukang Kebun</h4><p>Spons laut sangat agresif dalam memperebutkan ruang di dasar laut. Dengan memakan spons, Penyu Sisik "membersihkan" area tersebut sehingga koral pembentuk terumbu memiliki ruang untuk tumbuh. Tanpa penyu sisik, terumbu karang akan mati tertutup spons.</p><h4>Tortoiseshell Trade</h4><p>Cangkangnya memiliki corak batik kuning-cokelat yang sangat indah. Ironisnya, mereka diburu (secara ilegal) secara global untuk dibuat kacamata, sisir, dan perhiasan (dikenal sebagai produk <em>Tortoiseshell</em>).</p>`, 
              kuis: [
                  { pertanyaan: "Bentuk mulut/paruh Penyu Sisik berevolusi secara unik menyerupai...", opsi: ["Mulut buaya", "Paruh elang", "Belalai", "Gigi hiu"], jawabanBenar: 1 },
                  { pertanyaan: "Apa dampak positif dari kebiasaan makan Penyu Sisik bagi ekosistem laut?", opsi: ["Mengurangi jumlah ubur-ubur beracun", "Mencegah pertumbuhan spons yang menutupi terumbu karang", "Membersihkan rumput laut yang mati", "Memecah karang mati menjadi pasir"], jawabanBenar: 1 },
                  { pertanyaan: "Meskipun dilindungi, Penyu Sisik terus diburu di pasar gelap untuk diambil apanya?", opsi: ["Dagingnya untuk sup", "Telurnya", "Cangkangnya untuk kerajinan perhiasan (Tortoiseshell)", "Siripnya untuk obat"], jawabanBenar: 2 }
              ] 
            },
            { kategori: "reptilia", icon: "🦖", judul: "Komodo: Sang Naga Purba (MUR Reptilia)", deskripsi: "Kadal endemik terbesar di dunia yang dilengkapi bisa.", 
              materi: `<h4>Anatomi Pemburu</h4><p>Biawak Komodo (<em>Varanus komodoensis</em>) adalah kadal raksasa karnivora. Air liur mereka mengandung puluhan jenis bakteri mematikan dan memiliki kelenjar racun (bisa) di rahang bawahnya yang menyebabkan mangsanya kehabisan darah dan syok.</p><h4>Partenogenesis</h4><p>Komodo betina memiliki kemampuan adaptasi luar biasa yang disebut <em>Partenogenesis</em>: mereka mampu bertelur dan menetaskan anak tanpa proses perkawinan dengan jantan jika terisolasi di pulau kosong.</p><h4>Ancaman Spesifik</h4><p>Sebagai apex predator, mereka sangat rentan jika mangsa utama mereka (rusa Timor dan babi hutan) berkurang drastis akibat perburuan liar oleh manusia. Kenaikan permukaan air laut juga mengancam luas area pulau habitat mereka.</p>`, 
              kuis: [
                  { pertanyaan: "Senjata mematikan apa yang tersembunyi di rahang bawah seekor Komodo?", opsi: ["Gigi taring yang bisa menyuntikkan asam", "Kelenjar racun dan bakteri mematikan", "Lidah yang mengandung listrik", "Tulang yang bisa ditembakkan"], jawabanBenar: 1 },
                  { pertanyaan: "Apa istilah ilmiah untuk kemampuan Komodo betina menghasilkan keturunan tanpa perkawinan?", opsi: ["Fotosintesis", "Fragmentasi", "Partenogenesis", "Hermaprodit"], jawabanBenar: 2 },
                  { pertanyaan: "Ancaman utama yang disebabkan manusia terhadap kelestarian Komodo adalah...", opsi: ["Perburuan Rusa Timor secara ilegal", "Penanaman pohon kelapa", "Penambangan emas di pulau", "Polusi udara parah"], jawabanBenar: 0 }
              ] 
            },
            // PISCES
            { kategori: "pisces", icon: "🦈", judul: "Hiu Paus: Raksasa Totol yang Jinak (UR Pisces)", deskripsi: "Ikan terbesar di lautan yang memakan plankton.", 
              materi: `<h4>Filter Feeder</h4><p>Hiu Paus (<em>Rhincodon typus</em>) adalah spesies ikan terbesar di dunia. Berbeda dengan hiu predator lainnya, hiu paus adalah <em>filter feeder</em>. Mereka membuka mulut lebarnya untuk menelan air laut, lalu menyaring plankton dan ikan kecil menggunakan insangnya.</p><h4>Identifikasi Individu</h4><p>Mereka memiliki pola bintik (totol) putih di tubuhnya. Hebatnya, pola bintik tepat di belakang insang hiu paus ini bersifat unik pada setiap individu, persis seperti sidik jari manusia, yang sangat memudahkan ilmuwan melakukan sensus.</p><h4>Ancaman Laut Modern</h4><p>Pergerakannya yang lambat dekat permukaan membuat mereka rawan terkena <em>ship strike</em> (baling-baling kapal). Mereka juga rentan menelan limbah mikroplastik secara tidak sengaja.</p>`, 
              kuis: [
                  { pertanyaan: "Bagaimana cara Hiu Paus mencari makan di lautan lepas?", opsi: ["Mengejar mangsa dengan kecepatan tinggi", "Menyaring plankton dari air menggunakan mulut lebarnya", "Menggigit karang untuk mencari cacing", "Menyergap mangsa dari dasar laut"], jawabanBenar: 1 },
                  { pertanyaan: "Apa fungsi dari pola totol (bintik putih) di tubuh Hiu Paus bagi para ilmuwan?", opsi: ["Digunakan sebagai identifikasi sidik jari individu", "Untuk menentukan jenis kelaminnya", "Untuk mengetahui usia ikan tersebut", "Sebagai indikator penyakit"], jawabanBenar: 0 },
                  { pertanyaan: "Karena sering berenang lambat di permukaan laut, bahaya fisik apa yang sering menimpa mereka?", opsi: ["Tertusuk terumbu karang tajam", "Tertabrak kapal dan terkena sayatan baling-baling", "Diserang oleh burung camar", "Tersapu badai ke daratan"], jawabanBenar: 1 }
              ] 
            },
            { kategori: "pisces", icon: "🐟", judul: "Arwana Super Red: Permata Sungai Kapuas (MUR Pisces)", deskripsi: "Ikan purba air tawar yang memiliki teknik melindungi anak yang unik.", 
              materi: `<h4>Ikan Purba</h4><p>Arwana Super Red (<em>Scleropages formosus</em>) adalah ikan air tawar endemik yang hanya bisa ditemukan di Sungai Kapuas dan Danau Sentarum, Kalimantan Barat. Ikan ini memiliki struktur tulang kepala yang keras dan sisik besar yang berkilau merah menyala, peninggalan anatomi dari zaman prasejarah.</p><h4>Mouthbrooder</h4><p>Arwana memiliki perilaku pengasuhan anak yang disebut <em>Mouthbrooding</em>. Sang jantan akan menyimpan dan mengerami telur-telur di dalam mulutnya selama berminggu-minggu demi melindunginya dari predator air tawar lainnya.</p><h4>Ancaman Perdagangan</h4><p>Warna merahnya sering dikaitkan dengan mitos pembawa keberuntungan. Hal ini memicu perburuan liar besar-besaran untuk industri ikan hias eksotis mahal, membuatnya berstatus <em>Endangered</em>.</p>`, 
              kuis: [
                  { pertanyaan: "Di wilayah sungai manakah Arwana Super Red ini merupakan satwa endemik?", opsi: ["Sungai Musi, Sumatra", "Sungai Kapuas, Kalimantan Barat", "Sungai Mahakam, Kalimantan Timur", "Sungai Memberamo, Papua"], jawabanBenar: 1 },
                  { pertanyaan: "Perilaku unik apa yang dilakukan Arwana jantan untuk melindungi keturunannya?", opsi: ["Membangun sarang dari lumpur keras", "Menyimpan dan mengerami telur di dalam mulutnya", "Mengubur telurnya di dasar pasir", "Menempelkan telur di balik daun eceng gondok"], jawabanBenar: 1 },
                  { pertanyaan: "Faktor utama yang menyebabkan status ikan purba ini menjadi terancam punah adalah...", opsi: ["Pencemaran limbah pabrik kelapa sawit", "Masuknya ikan predator invasif", "Perburuan besar-besaran untuk industri ikan hias peliharaan mahal", "Kekeringan panjang akibat El Nino"], jawabanBenar: 2 }
              ] 
            },
            // AMPHIBIA
            { kategori: "amphibia", icon: "🐸", judul: "Katak Darah: Bio-Indikator TNGP (UR Amphibia)", deskripsi: "Katak pegunungan dengan bercak merah mematikan.", 
              materi: `<h4>Biologi Visual</h4><p>Katak Darah (<em>Leptophryne cruentata</em>) adalah spesies katak endemik yang hanya hidup di Taman Nasional Gunung Gede Pangrango (TNGP). Dinamakan "katak darah" karena tubuhnya ditutupi oleh bercak-bercak merah gelap yang menyerupai darah, sebagai bentuk kamuflase visual di lantai hutan basah.</p><h4 >Indikator Lingkungan</h4><p>Amfibi ini bernapas sebagian melalui kulitnya yang sangat permeabel. Karena itu, mereka dijadikan <em>Bio-Indikator</em>: jika kualitas air sungai pegunungan sedikit saja tercemar, mereka akan langsung mati.</p><h4>Pandemi Amfibi</h4><p>Ancaman terbesarnya selain hilangnya habitat dan letusan gunung berapi adalah wabah Jamur <em>Chytrid</em> (Chytridiomycosis), infeksi jamur mikroskopis yang menyumbat pori-pori kulit amfibi secara global dan membuat mereka mati lemas.</p>`, 
              kuis: [
                  { pertanyaan: "Mengapa Katak Darah sangat ideal dijadikan sebagai Bio-Indikator kualitas lingkungan?", opsi: ["Karena suaranya akan hilang jika polusi meningkat", "Karena kulitnya yang menyerap air sangat sensitif terhadap sekecil apa pun pencemaran toksik", "Karena mereka akan memakan sampah di sungai", "Karena warnanya akan berubah menjadi hijau jika air kotor"], jawabanBenar: 1 },
                  { pertanyaan: "Penyakit patogen global apa yang mematikan bagi populasi katak ini?", opsi: ["Virus Rabies", "Flu Burung", "Infeksi Jamur Chytrid", "Bakteri Salmonella"], jawabanBenar: 2 },
                  { pertanyaan: "Hanya di wilayah konservasi manakah Katak Darah endemik ini bisa dijumpai?", opsi: ["TN Baluran", "TN Gunung Rinjani", "TN Gunung Gede Pangrango", "TN Bukit Barisan Selatan"], jawabanBenar: 2 }
              ] 
            },
            { kategori: "amphibia", icon: "🐸", judul: "Katak Terbang Wallace: Penerbang Tajuk (MUR Amphibia)", deskripsi: "Amfibi hutan hujan lebat yang berevolusi menembus gravitasi.", 
              materi: `<h4>Evolusi Parasut</h4><p>Katak Terbang Wallace (<em>Rhacophorus nigropalmatus</em>) tidak benar-benar mengepakkan sayap seperti burung. Mereka berevolusi memiliki selaput (jaring) yang sangat lebar memanjang di antara jari-jari kaki dan tangannya.</p><h4>Kehidupan Kanopi</h4><p>Mereka menghabiskan hampir seluruh hidupnya di lapisan kanopi (tajuk) pohon tertinggi di hutan hujan Sumatra dan Kalimantan. Saat harus pindah pohon untuk mencari pasangan, mereka akan melompat dan merentangkan keempat kakinya, mengubah selaput tersebut menjadi parasut untuk "melayang" (gliding) turun secara diagonal.</p><h4>Ancaman Deforestasi</h4><p>Spesies ini sangat bergantung pada kerapatan pohon hutan hujan. Pembalakan liar (illegal logging) yang menciptakan ruang kosong antar pohon membuat mereka tidak bisa lagi melayang untuk mencari makan.</p>`, 
              kuis: [
                  { pertanyaan: "Bagaimana cara kerja mekanisme 'terbang' pada katak ini?", opsi: ["Mengepakkan lengan dengan cepat", "Melayang menggunakan selaput jari yang sangat lebar seperti parasut", "Menggunakan angin puting beliung", "Memiliki bulu kecil di badannya"], jawabanBenar: 1 },
                  { pertanyaan: "Di bagian manakah dari hutan hujan katak ini menghabiskan waktu hidupnya?", opsi: ["Di dalam gua bawah tanah", "Di dasar sungai berbatu", "Di lapisan kanopi (pucuk pohon tinggi)", "Di semak-semak paku"], jawabanBenar: 2 },
                  { pertanyaan: "Sesuai namanya, nama 'Wallace' didedikasikan untuk menghormati naturalis asal Inggris. Siapakah beliau?", opsi: ["Charles Darwin", "Alfred Russel Wallace", "David Attenborough", "Steve Irwin"], jawabanBenar: 1 }
              ] 
            },
            // INVERTEBRATA
            { kategori: "invertebrata", icon: "🦋", judul: "Kupu-Kupu Goliath: Raksasa Arfak (UR Invertebrata)", deskripsi: "Serangga terbang raksasa dengan mekanisme pertahanan racun ulat.", 
              materi: `<h4>Sayap Raksasa</h4><p>Kupu-Kupu Goliath (<em>Ornithoptera goliath</em>) adalah kupu-kupu terbesar kedua di dunia yang berhabitat di dataran tinggi Papua (Pegunungan Arfak). Betinanya bisa memiliki rentang sayap hingga 28 cm.</p><h4 >Pertahanan Beracun</h4><p>Saat masih berfase ulat (caterpillar), mereka secara eksklusif memakan daun dari tanaman merambat <em>Aristolochia</em> yang sangat beracun. Racun tersebut disimpan di dalam tubuhnya bahkan hingga bermetamorfosis menjadi kupu-kupu, membuat burung pemangsa akan muntah jika memakannya.</p><h4>Eksploitasi Kolektor</h4><p>Warna jantannya yang hijau-emas cerah membuat mereka menjadi target perburuan ilegal yang dihargai mahal oleh kolektor serangga internasional. Mereka juga sangat rentan jika cuaca habitat alaminya memanas.</p>`, 
              kuis: [
                  { pertanyaan: "Dari tanaman beracun apakah ulat Kupu-Kupu Goliath ini mendapatkan pertahanan tubuhnya?", opsi: ["Tanaman Venus", "Tanaman merambat Aristolochia", "Bunga Anggrek Hitam", "Pohon Beringin"], jawabanBenar: 1 },
                  { pertanyaan: "Wilayah pegunungan mana di Papua yang menjadi habitat endemik Kupu-kupu raksasa ini?", opsi: ["Pegunungan Jaya Wijaya", "Pegunungan Arfak", "Pegunungan Dieng", "Pegunungan Bintang"], jawabanBenar: 1 },
                  { pertanyaan: "Mengapa burung predator di hutan biasanya menghindari memakan kupu-kupu ini?", opsi: ["Karena sayapnya terlalu keras", "Karena tubuh kupu-kupu ini menyimpan racun dari makanan saat masih menjadi ulat", "Karena kecepatan terbangnya setara dengan burung elang", "Karena warnanya menyilaukan mata"], jawabanBenar: 1 }
              ] 
            },
            { kategori: "invertebrata", icon: "🦗", judul: "Belalang Anggrek: Sang Penipu Cantik (MUR Invertebrata)", deskripsi: "Insekta pembunuh dengan taktik kamuflase mimikri agresif sempurna.", 
              materi: `<h4>Mimikri Agresif</h4><p>Belalang Anggrek (<em>Hymenopus coronatus</em>) adalah predator mematikan berkedok bunga cantik. Tubuh dan kakinya berevolusi menyerupai kelopak bunga anggrek berwarna merah muda cerah. Alih-alih bersembunyi (mimikri defensif), mereka menggunakan warna ini untuk <em>Mimikri Agresif</em>: menipu dan memikat serangga penyerbuk seperti lebah agar mendekat, lalu langsung ditangkap dengan capit tajamnya.</p><h4>Dimorfisme Seksual</h4><p>Spesies ini menunjukkan dimorfisme seksual ukuran yang sangat ekstrem. Belalang anggrek betina bisa tumbuh hingga 6-7 cm, sementara jantannya hanya berukuran sekitar 2 cm dan lebih sering terbang untuk mencari pasangan.</p><h4>Ancaman Perburuan</h4><p>Keindahannya membuat belalang ini ditangkap habis-habisan secara ilegal untuk dijual hidup-hidup sebagai hewan peliharaan eksotis mahal di komunitas pecinta terarium global.</p>`, 
              kuis: [
                  { pertanyaan: "Apa yang dimaksud dengan 'Mimikri Agresif' yang dilakukan Belalang Anggrek?", opsi: ["Berubah warna sesuai lingkungan untuk bersembunyi dari predator", "Menyamar menjadi sesuatu yang menarik (bunga) untuk menjebak dan memakan mangsa yang mendekat", "Mengeluarkan suara berisik untuk menakut-nakuti mangsa", "Berpura-pura mati saat disentuh manusia"], jawabanBenar: 1 },
                  { pertanyaan: "Mangsa utama apa yang paling sering tertipu oleh penampilan Belalang Anggrek?", opsi: ["Katak pohon", "Burung pemakan biji", "Serangga penyerbuk seperti lebah dan kupu-kupu kecil", "Cacing tanah"], jawabanBenar: 2 },
                  { pertanyaan: "Perbedaan fisik ekstrem apa yang terlihat antara betina dan jantan belalang ini?", opsi: ["Betina memiliki sayap, jantan tidak", "Betina berukuran jauh lebih besar daripada jantannya", "Jantan berwarna hijau, betina berwarna hitam", "Jantan memiliki racun mematikan"], jawabanBenar: 1 }
              ] 
            }
        ];

        // DB SATWA 6 KELAS
        let boxMamalia = { total: 40, sisa: 40, prizes: [
            { tier: 'UR', name: 'Badak Jawa', rarity: 'UR', stock: 2, init: 2, icon: '🦏', status: 'Critically Endangered', fakta: 'Mamalia terlangka di dunia, dikenali dari satu cula kecilnya.', habitat: 'Taman Nasional Ujung Kulon.', ancaman: 'Populasi rentan penyakit dan inbreeding.' },
            { tier: 'SSR', name: 'Harimau Sumatra', rarity: 'SSR', stock: 4, init: 4, icon: '🐅', status: 'Critically Endangered', fakta: 'Subspesies harimau terkecil dengan loreng paling rapat.', habitat: 'Hutan tropis dataran rendah Sumatra.', ancaman: 'Deforestasi dan jerat pemburu gelap.' },
            { tier: 'SR', name: 'Bekantan', rarity: 'SR', stock: 8, init: 8, icon: '🐒', status: 'Endangered', fakta: 'Primata berhidung panjang dan perenang handal.', habitat: 'Hutan riparian dan mangrove.', ancaman: 'Konversi mangrove menjadi tambak.' },
            { tier: 'R', name: 'Rusa Bawean', rarity: 'R', stock: 12, init: 12, icon: '🦌', status: 'Vulnerable', fakta: 'Rusa endemik berukuran kecil yang sangat gesit.', habitat: 'Hutan sekunder Pulau Bawean.', ancaman: 'Kehilangan habitat.' },
            { tier: 'N', name: 'Kancil', rarity: 'N', stock: 14, init: 14, icon: '🦌', status: 'Least Concern', fakta: 'Mamalia kuku belah terkecil di dunia.', habitat: 'Hutan tropis lebat.', ancaman: 'Perburuan konsumsi lokal.' }
        ], lastOne: { name: 'Paus Biru', rarity: 'MUR', icon: '🐋', status: 'Endangered', fakta: 'Mamalia laut raksasa, hewan terbesar yang pernah hidup di Bumi.', habitat: 'Samudera lepas.', ancaman: 'Polusi suara laut.' }};

        let boxAves = { total: 40, sisa: 40, prizes: [
            { tier: 'UR', name: 'Jalak Bali', rarity: 'UR', stock: 2, init: 2, icon: '🕊️', status: 'Critically Endangered', fakta: 'Burung endemik Bali bersayap putih bersih dengan pelipis biru.', habitat: 'Taman Nasional Bali Barat.', ancaman: 'Perdagangan burung kicau.' },
            { tier: 'SSR', name: 'Elang Jawa', rarity: 'SSR', stock: 4, init: 4, icon: '🦅', status: 'Endangered', fakta: 'Burung pemangsa endemik Jawa, inspirasi lambang negara Garuda.', habitat: 'Hutan primer dan pegunungan Jawa.', ancaman: 'Deforestasi dan penangkapan ilegal.' },
            { tier: 'SR', name: 'Rangkong Gading', rarity: 'SR', stock: 8, init: 8, icon: '🦤', status: 'Critically Endangered', fakta: 'Memiliki helm (casque) paruh yang sangat padat dan keras.', habitat: 'Hutan primer Kalimantan & Sumatra.', ancaman: 'Perburuan paruh (gading merah).' },
            { tier: 'R', name: 'Kakatua Raja', rarity: 'R', stock: 12, init: 12, icon: '🦜', status: 'Least Concern', fakta: 'Kakatua hitam raksasa dengan pipi merah yang bisa berubah warna.', habitat: 'Hutan hujan dataran rendah Papua.', ancaman: 'Penangkapan peliharaan.' },
            { tier: 'N', name: 'Burung Gereja', rarity: 'N', stock: 14, init: 14, icon: '🐦', status: 'Least Concern', fakta: 'Sangat adaptif dan sering bersarang di atap rumah.', habitat: 'Pemukiman manusia seluruh Indonesia.', ancaman: 'Polusi udara kota.' }
        ], lastOne: { name: 'Cendrawasih', rarity: 'MUR', icon: '🦚', status: 'Least Concern', fakta: 'Dijuluki Burung Surga karena bulu jantannya yang sangat indah.', habitat: 'Hutan Papua.', ancaman: 'Perburuan bulu eksotis.' }};

        let boxReptilia = { total: 40, sisa: 40, prizes: [
            { tier: 'UR', name: 'Penyu Sisik', rarity: 'UR', stock: 2, init: 2, icon: '🐢', status: 'Critically Endangered', fakta: 'Pembersih karang alami pemakan spons beracun.', habitat: 'Terumbu karang tropis dangkal.', ancaman: 'Cangkangnya diburu untuk perhiasan.' },
            { tier: 'SSR', name: 'Buaya Muara', rarity: 'SSR', stock: 4, init: 4, icon: '🐊', status: 'Least Concern', fakta: 'Reptil terbesar di dunia yang masih hidup saat ini.', habitat: 'Muara sungai, rawa, dan pesisir.', ancaman: 'Konflik manusia dan hilangnya rawa.' },
            { tier: 'SR', name: 'Sanca Kembang', rarity: 'SR', stock: 8, init: 8, icon: '🐍', status: 'Least Concern', fakta: 'Ular terpanjang di dunia, perenang yang sangat andal.', habitat: 'Hutan tropis dekat sumber air.', ancaman: 'Perburuan untuk kulitnya.' },
            { tier: 'R', name: 'Biawak Air', rarity: 'R', stock: 12, init: 12, icon: '🦎', status: 'Least Concern', fakta: 'Kadal perenang oportunis yang memakan bangkai dan hewan kecil.', habitat: 'Sungai, rawa, selokan.', ancaman: 'Ditangkap untuk perdagangan.' },
            { tier: 'N', name: 'Tokek Rumah', rarity: 'N', stock: 14, init: 14, icon: '🦎', status: 'Least Concern', fakta: 'Kadal malam yang bisa menempel kuat di dinding.', habitat: 'Hutan sekunder dan pemukiman.', ancaman: 'Perburuan akibat mitos obat.' }
        ], lastOne: { name: 'Komodo', rarity: 'MUR', icon: '🦖', status: 'Vulnerable', fakta: 'Kadal purba raksasa berliur racun endemik Indonesia.', habitat: 'Taman Nasional Komodo.', ancaman: 'Penurunan mangsa akibat perburuan manusia.' }};

        let boxPisces = { total: 40, sisa: 40, prizes: [
            { tier: 'UR', name: 'Hiu Paus', rarity: 'UR', stock: 2, init: 2, icon: '🦈', status: 'Endangered', fakta: 'Ikan terbesar di lautan, pemakan plankton jinak.', habitat: 'Perairan pelagis tropis.', ancaman: 'Tertabrak kapal niaga.' },
            { tier: 'SSR', name: 'Pari Manta', rarity: 'SSR', stock: 4, init: 4, icon: '🐡', status: 'Endangered', fakta: 'Pari raksasa dengan otak terbesar di antara ikan.', habitat: 'Terumbu karang dan lautan terbuka.', ancaman: 'Perburuan insang.' },
            { tier: 'SR', name: 'Ikan Napoleon', rarity: 'SR', stock: 8, init: 8, icon: '🐟', status: 'Endangered', fakta: 'Ikan karang raksasa yang bisa mengubah jenis kelamin.', habitat: 'Terumbu karang tropis.', ancaman: 'Destructive fishing (bom/racun).' },
            { tier: 'R', name: 'Kuda Laut', rarity: 'R', stock: 12, init: 12, icon: '🐎', status: 'Vulnerable', fakta: 'Jantan yang mengandung dan melahirkan anak.', habitat: 'Padang lamun dan terumbu karang.', ancaman: 'Akuarium hias.' },
            { tier: 'N', name: 'Ikan Badut', rarity: 'N', stock: 14, init: 14, icon: '🐠', status: 'Least Concern', fakta: 'Memiliki lendir kebal dari sengatan anemon laut.', habitat: 'Anemon laut terumbu karang.', ancaman: 'Penangkapan berlebih ikan hias.' }
        ], lastOne: { name: 'Arwana Super Red', rarity: 'MUR', icon: '🐟', status: 'Endangered', fakta: 'Ikan purba air tawar dengan warna merah menyala.', habitat: 'Sungai Kapuas dan rawa Kalimantan.', ancaman: 'Perdagangan peliharaan ilegal.' }};

        let boxAmphibia = { total: 40, sisa: 40, prizes: [
            { tier: 'UR', name: 'Katak Darah', rarity: 'UR', stock: 2, init: 2, icon: '🐸', status: 'Critically Endangered', fakta: 'Katak endemik bercorak merah darah menyala.', habitat: 'Taman Nasional Gunung Gede Pangrango, Jawa Barat.', ancaman: 'Letusan gunung api dan penyakit jamur mematikan.' },
            { tier: 'SSR', name: 'Katak Tanduk', rarity: 'SSR', stock: 4, init: 4, icon: '🐸', status: 'Least Concern', fakta: 'Kamuflase daun kering dengan tonjolan seperti tanduk di atas matanya.', habitat: 'Hutan hujan primer Kalimantan.', ancaman: 'Perdagangan eksotis.' },
            { tier: 'SR', name: 'Katak Pohon', rarity: 'SR', stock: 8, init: 8, icon: '🐸', status: 'Least Concern', fakta: 'Bisa melompat dan menempel di daun basah berkat bantalan lengket di jarinya.', habitat: 'Pepohonan dan tajuk hutan tropis.', ancaman: 'Penebangan hutan.' },
            { tier: 'R', name: 'Kodok Lembu', rarity: 'R', stock: 12, init: 12, icon: '🐸', status: 'Least Concern', fakta: 'Memiliki suara menggelegar mirip auman anak lembu.', habitat: 'Perairan tenang dan lahan basah.', ancaman: 'Spesies invasif.' },
            { tier: 'N', name: 'Bangkong Kolong', rarity: 'N', stock: 14, init: 14, icon: '🐸', status: 'Least Concern', fakta: 'Banyak ditemukan bersembunyi di bawah batu atau kayu lapuk.', habitat: 'Lingkungan lembab.', ancaman: 'Pencemaran air.' }
        ], lastOne: { name: 'Katak Terbang Wallace', rarity: 'MUR', icon: '🐸', status: 'Least Concern', fakta: 'Memiliki selaput jari sangat lebar yang memungkinkannya melayang antar pohon.', habitat: 'Hutan hujan lebat Sumatra dan Kalimantan.', ancaman: 'Pembalakan liar.' }};

        let boxInvertebrata = { total: 40, sisa: 40, prizes: [
            { tier: 'UR', name: 'Kupu Goliath', rarity: 'UR', stock: 2, init: 2, icon: '🦋', status: 'Vulnerable', fakta: 'Kupu-kupu terbesar kedua di dunia yang rentan terhadap perubahan suhu.', habitat: 'Hutan primer dataran tinggi Papua.', ancaman: 'Diburu agresif kolektor.' },
            { tier: 'SSR', name: 'Ketam Kenari', rarity: 'SSR', stock: 4, init: 4, icon: '🦀', status: 'Vulnerable', fakta: 'Artropoda darat terbesar di dunia, capitnya bisa menghancurkan batok kelapa.', habitat: 'Pulau kecil dengan pohon kelapa.', ancaman: 'Dikonsumsi manusia.' },
            { tier: 'SR', name: 'Kalajengking Hutan', rarity: 'SR', stock: 8, init: 8, icon: '🦂', status: 'Least Concern', fakta: 'Memancarkan cahaya kebiruan yang terang saat disinari UV.', habitat: 'Celah bebatuan serasah hutan gelap.', ancaman: 'Perdagangan peliharaan.' },
            { tier: 'R', name: 'Bintang Laut', rarity: 'R', stock: 12, init: 12, icon: '⭐', status: 'Least Concern', fakta: 'Tidak memiliki otak atau darah, dan mampu menumbuhkan lengannya yang putus.', habitat: 'Dasar terumbu karang dangkal.', ancaman: 'Polusi air laut.' },
            { tier: 'N', name: 'Kumbang Badak', rarity: 'N', stock: 14, init: 14, icon: '🪲', status: 'Least Concern', fakta: 'Mampu mengangkat beban 850 kali lipat berat tubuhnya sendiri.', habitat: 'Pohon lapuk dan perkebunan.', ancaman: 'Diberantas sebagai hama.' }
        ], lastOne: { name: 'Belalang Anggrek', rarity: 'MUR', icon: '🦗', status: 'Least Concern', fakta: 'Evolusi kaki dan warnanya berkamuflase menyerupai bunga anggrek untuk menipu mangsa.', habitat: 'Hutan tropis berbunga.', ancaman: 'Pencurian untuk peliharaan eksotis.' }};

        const masterSatwa = [
            ...boxMamalia.prizes, boxMamalia.lastOne, 
            ...boxAves.prizes, boxAves.lastOne, 
            ...boxReptilia.prizes, boxReptilia.lastOne, 
            ...boxPisces.prizes, boxPisces.lastOne, 
            ...boxAmphibia.prizes, boxAmphibia.lastOne, 
            ...boxInvertebrata.prizes, boxInvertebrata.lastOne
        ];

        const courseCatalog = [
            { id: 1, category: 'Dasar Konservasi', icon: '🌱', provider: 'FaunaHeaven Academy', title: 'Pengantar Konservasi Satwa Indonesia', description: 'Kenali prinsip dasar konservasi, ancaman kepunahan, dan cara sederhana ikut melindungi satwa.', level: 'Pemula', duration: '2 jam', rating: '4.9', lessons: ['Mengapa keanekaragaman hayati penting', 'Mengenal status konservasi IUCN', 'Aksi konservasi di sekitar kita'] },
            { id: 2, category: 'Mamalia', icon: '🦏', provider: 'Kelas Mamalia', title: 'Badak Jawa dan Ekosistem Ujung Kulon', description: 'Pelajari habitat, perilaku, dan strategi perlindungan mamalia paling langka di Nusantara.', level: 'Pemula', duration: '1,5 jam', rating: '4.8', lessons: ['Biologi Badak Jawa', 'Ekosistem Ujung Kulon', 'Studi kasus perlindungan habitat'] },
            { id: 3, category: 'Ekosistem Laut', icon: '🐋', provider: 'Kelas Laut Biru', title: 'Menjaga Terumbu Karang Indonesia', description: 'Pahami hubungan antara terumbu karang, satwa laut, masyarakat pesisir, dan perubahan iklim.', level: 'Menengah', duration: '3 jam', rating: '4.9', lessons: ['Mengenal ekosistem terumbu', 'Penyu dan peran ekologisnya', 'Rencana aksi pesisir'] },
            { id: 4, category: 'Aves', icon: '🦜', provider: 'Kelas Burung Nusantara', title: 'Burung Endemik dan Hutan Tropis', description: 'Temukan peran burung endemik sebagai penyebar biji dan indikator kesehatan hutan.', level: 'Pemula', duration: '2 jam', rating: '4.7', lessons: ['Identifikasi burung endemik', 'Peran burung dalam hutan', 'Ancaman perdagangan ilegal'] },
            { id: 5, category: 'Sains Data', icon: '📊', provider: 'Lab Konservasi Digital', title: 'Membaca Data Populasi Satwa', description: 'Belajar membaca grafik, tren populasi, dan data pengamatan untuk mendukung keputusan konservasi.', level: 'Menengah', duration: '4 jam', rating: '4.8', lessons: ['Dasar data populasi', 'Membaca grafik dan tren', 'Membuat ringkasan pengamatan'] },
            { id: 6, category: 'Aksi Nyata', icon: '🤝', provider: 'Komunitas FaunaHeaven', title: 'Merancang Proyek Konservasi Lokal', description: 'Susun proyek kecil yang realistis untuk lingkungan sekolah, kampus, atau komunitas.', level: 'Menengah', duration: '2,5 jam', rating: '4.9', lessons: ['Memetakan masalah lokal', 'Menyusun tujuan proyek', 'Mengukur dampak dan keberlanjutan'] }
        ];
        let selectedCourse = null;
        let activeCourseCategory = 'Semua';
        let enrolledCourses = JSON.parse(localStorage.getItem('faunahaven_courses') || '[]');
        let activeLearningCourse = null;
        let activeLearningModule = 0;
        let courseProgress = JSON.parse(localStorage.getItem('faunahaven_course_progress') || '{}');

        const courseModules = {
            1: [
                { title: 'Mengapa konservasi penting?', summary: 'Memahami hubungan keanekaragaman hayati dengan kehidupan manusia.', body: '<p>Konservasi bukan hanya tentang menyelamatkan satwa langka. Konservasi menjaga hubungan antara habitat, spesies, dan masyarakat agar tetap seimbang.</p><div class="learning-callout"><b>Inti materi:</b> setiap spesies memiliki peran ekologis, sehingga hilangnya satu spesies dapat memengaruhi seluruh ekosistem.</div>', takeaways: ['Konservasi melindungi spesies dan habitatnya.', 'Keanekaragaman hayati mendukung pangan, air, dan kesehatan.', 'Aksi kecil yang konsisten dapat membantu pemulihan alam.'] },
                { title: 'Mengenal status konservasi IUCN', summary: 'Membaca kategori risiko dan memahami arti status kepunahan.', body: '<p>Daftar Merah IUCN membantu peneliti dan pengambil keputusan memetakan tingkat risiko suatu spesies. Status ini diperbarui berdasarkan data populasi, habitat, dan ancaman.</p><div class="learning-callout"><b>Perhatikan:</b> status <em>Critically Endangered</em> menunjukkan risiko kepunahan yang sangat tinggi di alam.</div>', takeaways: ['Status konservasi dibuat berdasarkan bukti ilmiah.', 'Data populasi perlu diperbarui secara berkala.', 'Status risiko membantu menentukan prioritas perlindungan.'] },
                { title: 'Aksi konservasi di sekitar kita', summary: 'Menyusun aksi sederhana yang dapat dilakukan di sekolah, kampus, dan komunitas.', body: '<p>Aksi konservasi yang baik dimulai dari masalah yang terukur. Amati lingkungan, tentukan tujuan, libatkan komunitas, lalu catat dampaknya.</p><div class="learning-callout"><b>Praktik:</b> pilih satu masalah lingkungan di sekitarmu dan tulis satu aksi yang bisa dimulai minggu ini.</div>', takeaways: ['Mulai dari masalah lokal yang jelas.', 'Libatkan orang lain agar dampak lebih besar.', 'Ukur hasil untuk memperbaiki aksi berikutnya.'] }
            ],
            2: [
                { title: 'Biologi Badak Jawa', summary: 'Mengenal ciri tubuh, perilaku, dan kebutuhan dasar Badak Jawa.', body: '<p>Badak Jawa adalah mamalia besar yang pemalu dan sangat bergantung pada habitat hutan serta area berkubang. Populasinya yang terkonsentrasi membuat perlindungan habitat menjadi sangat penting.</p><div class="learning-callout"><b>Fokus pengamatan:</b> cari hubungan antara perilaku berkubang, suhu tubuh, dan perlindungan dari parasit.</div>', takeaways: ['Badak Jawa memiliki satu cula kecil.', 'Habitat yang aman adalah kunci pemulihan populasi.', 'Populasi kecil membutuhkan pemantauan intensif.'] },
                { title: 'Ekosistem Ujung Kulon', summary: 'Memahami habitat terakhir Badak Jawa dan tantangan pengelolaannya.', body: '<p>Ujung Kulon menyediakan hutan, sumber air, dan ruang jelajah bagi Badak Jawa. Namun, bencana alam, penyakit, dan perubahan habitat dapat berdampak besar karena populasinya berada di satu kawasan.</p><div class="learning-callout"><b>Sudut pandang ekosistem:</b> melindungi badak berarti juga melindungi tumbuhan, air, dan satwa lain di habitatnya.</div>', takeaways: ['Habitat badak perlu dijaga secara menyeluruh.', 'Bencana alam menjadi risiko penting bagi populasi terpusat.', 'Kesehatan ekosistem mendukung kesehatan satwa.'] },
                { title: 'Studi kasus perlindungan habitat', summary: 'Menganalisis cara pemantauan dan perlindungan satwa langka.', body: '<p>Perlindungan habitat memerlukan patroli, kamera pemantau, pengelolaan pengunjung, serta kerja sama dengan masyarakat. Data lapangan membantu tim mengambil keputusan yang lebih tepat.</p><div class="learning-callout"><b>Pertanyaan refleksi:</b> data apa yang perlu dikumpulkan sebelum membuat keputusan konservasi?</div>', takeaways: ['Gunakan data untuk menentukan prioritas.', 'Kurangi gangguan manusia di area inti.', 'Kolaborasi lokal memperkuat perlindungan.'] }
            ],
            3: [
                { title: 'Mengenal ekosistem terumbu', summary: 'Melihat terumbu karang sebagai rumah bagi banyak organisme.', body: '<p>Terumbu karang dibangun oleh koloni karang kecil dan menjadi habitat bagi ikan, moluska, krustasea, serta banyak organisme lain. Ekosistem ini sensitif terhadap perubahan suhu dan kualitas air.</p><div class="learning-callout"><b>Konsep kunci:</b> terumbu yang sehat memiliki hubungan saling bergantung antara karang, alga, ikan, dan arus laut.</div>', takeaways: ['Terumbu karang adalah ekosistem dengan keanekaragaman tinggi.', 'Kualitas air memengaruhi kesehatan karang.', 'Kerusakan habitat berdampak pada masyarakat pesisir.'] },
                { title: 'Penyu dan peran ekologisnya', summary: 'Memahami peran penyu dalam menjaga keseimbangan laut.', body: '<p>Penyu membantu menjaga aliran energi di laut dan pantai. Perlindungan penyu perlu mencakup area makan, jalur migrasi, serta lokasi bertelur.</p><div class="learning-callout"><b>Catatan lapangan:</b> pencahayaan dan sampah plastik di pantai dapat mengganggu penyu.</div>', takeaways: ['Penyu membutuhkan lebih dari satu habitat.', 'Sampah plastik menjadi ancaman langsung.', 'Perlindungan pantai harus melibatkan masyarakat.'] },
                { title: 'Rencana aksi pesisir', summary: 'Menyusun rencana proyek sederhana untuk pesisir yang lebih sehat.', body: '<p>Rencana aksi dapat dimulai dari pemetaan masalah, penentuan target, pembagian peran, dan evaluasi. Pilih kegiatan yang dapat diukur seperti pengurangan sampah atau pemantauan tutupan karang.</p><div class="learning-callout"><b>Template aksi:</b> masalah → tujuan → kegiatan → indikator → evaluasi.</div>', takeaways: ['Tetapkan indikator yang mudah diamati.', 'Gabungkan edukasi dengan aksi langsung.', 'Evaluasi hasil sebelum memperluas program.'] }
            ],
            4: [
                { title: 'Identifikasi burung endemik', summary: 'Mengenali ciri visual dan suara burung endemik Indonesia.', body: '<p>Identifikasi burung dilakukan dengan memperhatikan bentuk tubuh, warna, pola sayap, suara, dan habitat. Catatan pengamatan yang konsisten membantu memantau perubahan populasi.</p><div class="learning-callout"><b>Tips:</b> gunakan waktu, lokasi, dan cuaca sebagai bagian dari catatan pengamatan.</div>', takeaways: ['Gunakan beberapa ciri sekaligus.', 'Catat lokasi dan waktu pengamatan.', 'Hindari mengganggu burung saat mengamati.'] },
                { title: 'Peran burung dalam hutan', summary: 'Memahami burung sebagai penyebar biji dan indikator kesehatan hutan.', body: '<p>Burung membantu menyebarkan biji dan mengendalikan populasi serangga. Perubahan jumlah burung tertentu dapat menjadi tanda perubahan kualitas habitat.</p><div class="learning-callout"><b>Hubungkan konsep:</b> burung, pohon buah, dan regenerasi hutan membentuk satu jaringan ekologis.</div>', takeaways: ['Burung membantu regenerasi hutan.', 'Keberadaan burung mencerminkan kualitas habitat.', 'Hutan yang beragam menyediakan lebih banyak sumber pakan.'] },
                { title: 'Ancaman perdagangan ilegal', summary: 'Mengenali dampak perburuan dan perdagangan satwa terhadap populasi liar.', body: '<p>Perdagangan ilegal mengurangi populasi di alam dan dapat menyebarkan penyakit. Edukasi, penegakan hukum, dan pelaporan menjadi bagian penting dari pencegahan.</p><div class="learning-callout"><b>Aksi aman:</b> jangan membeli satwa liar atau produk turunannya dan laporkan perdagangan kepada pihak berwenang.</div>', takeaways: ['Jangan membeli satwa liar.', 'Perdagangan dapat memutus fungsi ekosistem.', 'Pelaporan membantu penegakan perlindungan.'] }
            ],
            5: [
                { title: 'Dasar data populasi', summary: 'Memahami cara membaca data jumlah dan persebaran satwa.', body: '<p>Data populasi perlu dikumpulkan dengan metode yang konsisten. Jumlah pengamatan, lokasi, waktu, dan metode pencatatan akan memengaruhi cara membaca hasilnya.</p><div class="learning-callout"><b>Ingat:</b> satu kali pengamatan belum cukup untuk menyimpulkan tren populasi.</div>', takeaways: ['Gunakan metode yang sama untuk membandingkan data.', 'Catat konteks setiap pengamatan.', 'Bedakan data mentah dan kesimpulan.'] },
                { title: 'Membaca grafik dan tren', summary: 'Menemukan pola, kenaikan, penurunan, dan anomali pada grafik.', body: '<p>Grafik membantu melihat perubahan dari waktu ke waktu. Perhatikan sumbu, satuan, rentang waktu, dan kemungkinan faktor luar sebelum menarik kesimpulan.</p><div class="learning-callout"><b>Checklist:</b> baca judul, sumbu, satuan, lalu bandingkan pola sebelum menyimpulkan.</div>', takeaways: ['Periksa skala grafik.', 'Cari pola jangka panjang.', 'Jangan menyamakan korelasi dengan sebab-akibat.'] },
                { title: 'Membuat ringkasan pengamatan', summary: 'Menyajikan hasil pengamatan menjadi ringkasan yang mudah dipahami.', body: '<p>Ringkasan yang baik menyebutkan pertanyaan, metode, temuan utama, keterbatasan, dan rekomendasi. Gunakan bahasa sederhana agar hasil dapat dipakai oleh lebih banyak orang.</p><div class="learning-callout"><b>Struktur:</b> tujuan → metode → temuan → makna → langkah berikutnya.</div>', takeaways: ['Sertakan batasan data.', 'Gunakan angka yang relevan.', 'Tutup dengan rekomendasi yang realistis.'] }
            ],
            6: [
                { title: 'Memetakan masalah lokal', summary: 'Menentukan masalah konservasi yang paling relevan di sekitar kita.', body: '<p>Mulai proyek dengan observasi dan percakapan bersama warga. Pemetaan membantu membedakan gejala, penyebab, dan pihak yang terdampak.</p><div class="learning-callout"><b>Pertanyaan awal:</b> apa masalahnya, siapa yang terdampak, dan bukti apa yang sudah tersedia?</div>', takeaways: ['Dengarkan pengalaman masyarakat.', 'Pisahkan penyebab dan gejala.', 'Gunakan bukti untuk memilih fokus.'] },
                { title: 'Menyusun tujuan proyek', summary: 'Membuat tujuan yang spesifik, realistis, dan dapat diukur.', body: '<p>Tujuan proyek sebaiknya menjawab perubahan apa yang ingin dicapai, pada siapa, di mana, dan kapan. Tujuan yang jelas memudahkan pembagian tugas dan evaluasi.</p><div class="learning-callout"><b>Gunakan prinsip SMART:</b> spesifik, terukur, dapat dicapai, relevan, dan berbatas waktu.</div>', takeaways: ['Tetapkan target yang realistis.', 'Pilih indikator keberhasilan.', 'Buat tenggat yang jelas.'] },
                { title: 'Mengukur dampak dan keberlanjutan', summary: 'Mengevaluasi hasil proyek dan memastikan aksi dapat dilanjutkan.', body: '<p>Dampak tidak hanya diukur dari jumlah kegiatan, tetapi juga dari perubahan perilaku, kondisi habitat, atau pengetahuan peserta. Dokumentasikan hasil dan rancang siapa yang melanjutkan program.</p><div class="learning-callout"><b>Penutup:</b> proyek yang baik meninggalkan pengetahuan, kebiasaan, dan sistem yang dapat diteruskan.</div>', takeaways: ['Bandingkan kondisi sebelum dan sesudah.', 'Dokumentasikan proses dan pembelajaran.', 'Siapkan penerus dan sumber daya.'] }
            ]
        };

        function renderCourseChips() {
            const categories = ['Semua', ...new Set(courseCatalog.map(course => course.category))];
            document.getElementById('courseChips').innerHTML = categories.map(category =>
                `<button class="course-chip ${category === activeCourseCategory ? 'active' : ''}" onclick="filterCoursesByCategory('${category}')">${category}</button>`
            ).join('');
        }

        function filterCoursesByCategory(category) {
            activeCourseCategory = category;
            renderCourseChips();
            renderCourses();
        }

        function renderCourses() {
            if (!document.getElementById('courseGrid')) return;
            const query = (document.getElementById('courseSearch').value || '').toLowerCase().trim();
            const results = courseCatalog.filter(course => {
                const matchesCategory = activeCourseCategory === 'Semua' || course.category === activeCourseCategory;
                const searchable = `${course.title} ${course.description} ${course.provider} ${course.category}`.toLowerCase();
                return matchesCategory && searchable.includes(query);
            });
            document.getElementById('courseResultCount').innerText = `Menampilkan ${results.length} dari ${courseCatalog.length} kursus`;
            document.getElementById('courseGrid').innerHTML = results.length ? results.map(course => `
                <article class="course-card" onclick="bukaDetailKursus(${course.id})">
                    <div class="course-cover">${course.icon}</div>
                    <div class="course-card-body">
                        <div class="course-provider">${course.provider}</div>
                        <h3>${course.title}</h3>
                        <div class="course-description">${course.description}</div>
                        <div class="course-meta"><span class="course-rating">★ ${course.rating}</span><span>⏱ ${course.duration}</span><span>${course.level}</span></div>
                        ${enrolledCourses.includes(course.id) ? '<div class="course-enrolled-label">✓ Terdaftar · buka untuk belajar</div>' : ''}
                    </div>
                </article>`).join('') : '<div style="grid-column:1/-1; padding:35px; color:#718096;">Kursus tidak ditemukan. Coba kata kunci lain.</div>';
        }

        function bukaDetailKursus(courseId) {
            selectedCourse = courseCatalog.find(course => course.id === courseId);
            if (!selectedCourse) return;
            document.getElementById('courseDetailCover').innerText = selectedCourse.icon;
            document.getElementById('courseDetailTitle').innerText = selectedCourse.title;
            document.getElementById('courseDetailProvider').innerText = `${selectedCourse.provider} · ${selectedCourse.level} · ★ ${selectedCourse.rating}`;
            document.getElementById('courseDetailDescription').innerText = selectedCourse.description;
            document.getElementById('courseDetailLessons').innerHTML = selectedCourse.lessons.map(lesson => `<li>${lesson}</li>`).join('');
            const isEnrolled = enrolledCourses.includes(selectedCourse.id);
            const button = document.getElementById('courseEnrollButton');
            button.innerText = isEnrolled ? 'Buka Ruang Belajar' : 'Daftar Kursus';
            button.disabled = false;
            button.onclick = isEnrolled ? () => bukaRuangBelajar(selectedCourse.id) : daftarKursusTerpilih;
            document.getElementById('modalCourseDetail').style.display = 'flex';
        }

        function tutupDetailKursus() { document.getElementById('modalCourseDetail').style.display = 'none'; }

        function getCourseModules(courseId) {
            const course = courseCatalog.find(item => item.id === courseId);
            return courseModules[courseId] || (course ? course.lessons.map(title => ({ title, summary: 'Materi inti kursus untuk memperkuat pemahamanmu.', body: `<p>${course.description}</p><div class="learning-callout"><b>Pelajari:</b> baca materi ini, catat ide penting, lalu tandai selesai.</div>`, takeaways: ['Pahami konsep utama materi.', 'Catat contoh yang relevan.', 'Hubungkan materi dengan aksi nyata.'] })) : []);
        }

        function getCourseCompleted(courseId) {
            return Array.isArray(courseProgress[courseId]) ? courseProgress[courseId] : [];
        }

        function bukaRuangBelajar(courseId) {
            if (!requireLogin('membuka ruang belajar')) return;
            if (!enrolledCourses.includes(courseId)) return;
            activeLearningCourse = courseCatalog.find(course => course.id === courseId);
            if (!activeLearningCourse) return;
            const modules = getCourseModules(courseId);
            const completed = getCourseCompleted(courseId);
            activeLearningModule = Math.min(completed.length, Math.max(0, modules.length - 1));
            document.getElementById('modalCourseDetail').style.display = 'none';
            document.getElementById('modalCourseLearning').style.display = 'flex';
            renderRuangBelajar();
        }

        function renderRuangBelajar() {
            if (!activeLearningCourse) return;
            const modules = getCourseModules(activeLearningCourse.id);
            const completed = getCourseCompleted(activeLearningCourse.id);
            const percent = modules.length ? Math.round((completed.length / modules.length) * 100) : 0;
            const current = modules[activeLearningModule] || modules[0];
            document.getElementById('learningCourseCover').innerText = activeLearningCourse.icon;
            document.getElementById('learningCourseProvider').innerText = activeLearningCourse.provider;
            document.getElementById('learningCourseTitle').innerText = activeLearningCourse.title;
            document.getElementById('learningProgressText').innerText = `${percent}%`;
            document.getElementById('learningProgressBar').style.width = `${percent}%`;
            document.getElementById('learningModuleList').innerHTML = modules.map((module, index) => {
                const isDone = completed.includes(index);
                return `<button class="learning-module-item ${index === activeLearningModule ? 'active' : ''} ${isDone ? 'completed' : ''}" onclick="pilihModulBelajar(${index})"><span class="learning-module-number">${isDone ? '✓' : index + 1}</span><span class="learning-module-name">${module.title}</span></button>`;
            }).join('');
            document.getElementById('learningContent').innerHTML = `
                <div class="learning-kicker">Modul ${activeLearningModule + 1} dari ${modules.length}</div>
                <h1>${current.title}</h1>
                <p><b>${current.summary}</b></p>
                ${current.body}
                <h3>Yang akan kamu bawa pulang</h3>
                <ul class="learning-takeaways">${current.takeaways.map(item => `<li>${item}</li>`).join('')}</ul>
                <button class="learning-complete-btn" onclick="tandaiModulSelesai()">${completed.includes(activeLearningModule) ? '✓ Modul sudah selesai' : 'Tandai selesai & lanjut'}</button>`;
        }

        function pilihModulBelajar(index) {
            if (!activeLearningCourse) return;
            activeLearningModule = index;
            renderRuangBelajar();
        }

        function tandaiModulSelesai() {
            if (!activeLearningCourse) return;
            const completed = getCourseCompleted(activeLearningCourse.id);
            if (!completed.includes(activeLearningModule)) completed.push(activeLearningModule);
            completed.sort((a, b) => a - b);
            courseProgress[activeLearningCourse.id] = completed;
            localStorage.setItem('faunahaven_course_progress', JSON.stringify(courseProgress));
            const modules = getCourseModules(activeLearningCourse.id);
            if (completed.length === modules.length && !courseRewardsClaimed[activeLearningCourse.id]) {
                const reward = 500;
                courseRewardsClaimed[activeLearningCourse.id] = true;
                localStorage.setItem('faunahaven_course_rewards', JSON.stringify(courseRewardsClaimed));
                koin += reward;
                updateCoin();
                bukaDialog('Course selesai! 🎉', `Selamat! Kamu telah menyelesaikan seluruh materi "${activeLearningCourse.title}".\n\nReward penyelesaian: +${reward} 🪙`);
            }
            if (activeLearningModule < modules.length - 1) activeLearningModule++;
            renderRuangBelajar();
        }

        function tutupRuangBelajar() {
            document.getElementById('modalCourseLearning').style.display = 'none';
            activeLearningCourse = null;
        }

        function daftarKursusTerpilih() {
            if (!selectedCourse || !requireLogin('mendaftar kursus')) return;
            if (!enrolledCourses.includes(selectedCourse.id)) enrolledCourses.push(selectedCourse.id);
            localStorage.setItem('faunahaven_courses', JSON.stringify(enrolledCourses));
            document.getElementById('courseEnrollButton').innerText = 'Buka Ruang Belajar';
            document.getElementById('courseEnrollButton').disabled = false;
            document.getElementById('courseEnrollButton').onclick = () => bukaRuangBelajar(selectedCourse.id);
            bukaDialog(`🎓 Kamu berhasil mendaftar kursus “${selectedCourse.title}”.`);
        }

        const faqData = [
            { q: 'Apakah saya harus login untuk membaca materi?', a: 'Tidak. Semua materi, katalog kursus, dan informasi konservasi dapat dibaca sebagai guest. Login diperlukan untuk menyimpan progres dan melakukan aksi seperti kuis, gacha, klaim reward, atau mendaftar kursus.' },
            { q: 'Bagaimana cara mendaftar kursus?', a: 'Buka Beranda, pilih kursus yang diminati, baca detail silabus, lalu tekan tombol Daftar Kursus. Kamu perlu login agar pendaftaran tersimpan.' },
            { q: 'Apa fungsi koin di EcoKuji?', a: 'Koin digunakan untuk melakukan penarikan EcoKuji. Hasil penarikan dapat disimpan ke koleksi atau duplikatnya dikonversi kembali menjadi koin.' },
            { q: 'Bagaimana cara menyelesaikan misi harian?', a: 'Baca jurnal konservasi dan selesaikan kuisnya. Progress misi akan bertambah setelah kuis selesai. Misi utama memberikan bonus ketika target hariannya tercapai.' },
            { q: 'Apakah data akun saya aman?', a: 'Versi saat ini menyimpan data secara lokal di browser menggunakan localStorage. Untuk penggunaan produksi, aplikasi sebaiknya dilengkapi backend dan autentikasi server.' },
            { q: 'Bagaimana cara menghubungi tim FaunaHeaven?', a: 'Gunakan halaman Bantuan & FAQ ini sebagai panduan awal. Integrasi kontak eksternal dapat ditambahkan pada pengembangan berikutnya.' }
        ];

        function renderFAQ() {
            const query = (document.getElementById('faqSearch')?.value || '').toLowerCase().trim();
            const results = faqData.filter(item => `${item.q} ${item.a}`.toLowerCase().includes(query));
            document.getElementById('faqList').innerHTML = results.length ? results.map((item, index) => `
                <div class="faq-item" id="faq-item-${index}">
                    <button class="faq-question" onclick="toggleFAQ(${index})"><span>${item.q}</span><span>＋</span></button>
                    <div class="faq-answer">${item.a}</div>
                </div>`).join('') : '<div style="padding:25px; color:#718096; text-align:center;">Pertanyaan tidak ditemukan.</div>';
        }

        function toggleFAQ(index) {
            const item = document.getElementById(`faq-item-${index}`);
            if (!item) return;
            item.classList.toggle('open');
            item.querySelector('.faq-question span:last-child').innerText = item.classList.contains('open') ? '−' : '＋';
        }

        function renderMisi() {
            const uniqueCount = masterSatwa.filter(satwa => koleksi.some(item => item.name === satwa.name)).length;
            const missions = [
                { icon: '📖', title: 'Selesaikan 2 jurnal', description: 'Baca materi dan selesaikan kuis dari dua jurnal edukasi.', current: questProgress, target: 2, reward: '+500 🪙', done: questClaimed },
                { icon: '🎓', title: 'Mulai satu kursus', description: 'Daftar minimal satu kursus dari katalog Beranda.', current: enrolledCourses.length > 0 ? 1 : 0, target: 1, reward: 'Progress belajar', done: enrolledCourses.length > 0 },
                { icon: '🦋', title: 'Temukan satwa baru', description: 'Kumpulkan satu satwa melalui EcoKuji dan tambahkan ke FaunaDex.', current: Math.min(uniqueCount, 1), target: 1, reward: 'Koleksi bertambah', done: uniqueCount > 0 }
            ];
            document.getElementById('dailyMissionGrid').innerHTML = missions.map(mission => {
                const percent = Math.min(100, Math.round((mission.current / mission.target) * 100));
                return `<div class="mission-card ${mission.done ? 'completed' : ''}">
                    <div class="mission-icon">${mission.icon}</div><h3>${mission.title}</h3><p>${mission.description}</p>
                    <div class="mission-progress"><div style="width:${percent}%"></div></div>
                    <div class="mission-footer"><span>${mission.done ? '✓ Selesai' : `${mission.current}/${mission.target} selesai`}</span><span class="mission-reward">${mission.reward}</span></div>
                </div>`;
            }).join('');
        }

        function updateCoin() { document.getElementById('coin-display').innerText = koin; updateProfilUI(); }
        
        function getProfileData() {
            if (!currentUser) return { name: 'Guest', avatar: '🎓', bio: 'Login untuk mengatur profilmu.' };
            try {
                return JSON.parse(localStorage.getItem(`faunahaven_profile_${currentUser}`) || '{}');
            } catch (error) { return {}; }
        }

        function updateProfilUI() {
            const profile = getProfileData();
            document.getElementById('profileUsername').innerText = profile.name || currentUser || 'Guest';
            document.getElementById('profileAvatar').innerText = profile.avatar || '🎓';
            document.getElementById('profileBio').innerText = profile.bio || 'Pecinta satwa dan penjaga alam Nusantara.';
            document.getElementById('profileKoin').innerText = koin;
            let count = 0;
            masterSatwa.forEach(s => { if(koleksi.some(k => k.name === s.name)) count++; });
            document.getElementById('profileKoleksi').innerText = `${count}/36`;
        }

        function bukaModalEditProfile() {
            if (!requireLogin('mengedit profil')) return;
            const profile = getProfileData();
            document.getElementById('editProfileName').value = profile.name || currentUser;
            document.getElementById('editProfileAvatar').value = profile.avatar || '🎓';
            document.getElementById('editProfileBio').value = profile.bio || '';
            document.getElementById('modalEditProfile').style.display = 'flex';
            setTimeout(() => document.getElementById('editProfileName').focus(), 0);
        }

        function tutupModalEditProfile() {
            document.getElementById('modalEditProfile').style.display = 'none';
        }

        function simpanProfil() {
            if (!requireLogin('menyimpan profil')) return;
            const name = document.getElementById('editProfileName').value.trim();
            const avatar = document.getElementById('editProfileAvatar').value;
            const bio = document.getElementById('editProfileBio').value.trim();
            if (name.length < 3) return bukaDialog('Nama tampilan minimal 3 karakter.');
            localStorage.setItem(`faunahaven_profile_${currentUser}`, JSON.stringify({ name, avatar, bio }));
            updateProfilUI();
            tutupModalEditProfile();
            bukaDialog('Profil berhasil diperbarui.');
        }

        function bukaModalLogin() {
            ubahModeAuth(false, 'login');
            document.getElementById('modalLogin').style.display = 'flex';
            setTimeout(() => document.getElementById('loginUsername').focus(), 0);
        }
        function tutupModalLogin() { document.getElementById('modalLogin').style.display = 'none'; }

        function ubahModeAuth(clearFields = true, requestedMode = null) {
            authMode = requestedMode || (authMode === 'login' ? 'register' : 'login');
            const isRegister = authMode === 'register';
            document.getElementById('loginFormFields').style.display = isRegister ? 'none' : 'block';
            document.getElementById('registerFormFields').style.display = isRegister ? 'block' : 'none';
            document.querySelector('#modalLogin h2').innerText = isRegister ? '📝 Daftar Akun' : '🔐 Masuk Akun';
            document.getElementById('authSwitchText').innerText = isRegister ? 'Sudah punya akun?' : 'Belum punya akun?';
            document.getElementById('authSwitchButton').innerText = isRegister ? 'Masuk sekarang' : 'Daftar sekarang';
            if (clearFields) {
                ['loginUsername', 'loginPassword', 'registerUsername', 'registerPassword', 'registerPasswordConfirm'].forEach(id => {
                    const field = document.getElementById(id);
                    if (field) field.value = '';
                });
            }
        }

        function requireLogin(action = 'melakukan aksi ini') {
            if (isAuthenticated && currentUser) return true;
            bukaDialog(`Silakan masuk akun terlebih dahulu untuk ${action}. Konten tetap dapat dilihat sebagai guest.`);
            bukaModalLogin();
            return false;
        }

        function updateAuthUI() {
            const button = document.getElementById('btnHeaderLogin');
            button.innerText = isAuthenticated ? currentUser : 'Masuk Akun';
            button.title = isAuthenticated ? `Login sebagai ${currentUser}` : 'Masuk untuk menggunakan fitur interaktif';
            document.getElementById('profileStatus').innerText = isAuthenticated ? 'Konservator Junior' : 'Guest — login untuk menyimpan progres';
        }
        
        function setTheme(theme) {
            const isDark = theme === 'dark';
            document.body.classList.toggle('dark-theme', isDark);
            localStorage.setItem('faunahaven_theme', isDark ? 'dark' : 'light');
            const button = document.getElementById('btnThemeToggle');
            if (button) {
                button.classList.toggle('is-dark', isDark);
                button.innerText = isDark ? '☀' : '☾';
                button.title = isDark ? 'Gunakan tema terang' : 'Gunakan tema gelap';
                button.setAttribute('aria-label', button.title);
            }
            const setting = document.getElementById('themeToggleSettings');
            if (setting) setting.checked = isDark;
        }

        function toggleTheme() {
            setTheme(document.body.classList.contains('dark-theme') ? 'light' : 'dark');
        }

        function applySavedTheme() {
            setTheme(localStorage.getItem('faunahaven_theme') || 'light');
        }

        function prosesLogin() {
            let userIn = document.getElementById('loginUsername').value;
            let passwordIn = document.getElementById('loginPassword').value;
            if(userIn.trim() !== "" && passwordIn.trim() !== "") {
                const akun = registeredUsers.find(user => user.username.toLowerCase() === userIn.trim().toLowerCase() && user.password === passwordIn);
                if (!akun) {
                    bukaDialog('Username atau password salah. Jika belum memiliki akun, silakan daftar terlebih dahulu.');
                    return;
                }
                currentUser = akun.username;
                isAuthenticated = true;
                localStorage.setItem('faunahaven_user', currentUser);
                updateAuthUI();
                bukaDialog(`✅ Selamat datang kembali, ${currentUser}!`);
                tutupModalLogin();
                updateProfilUI();
            } else {
                bukaDialog("Masukkan username dan password terlebih dahulu!");
            }
        }

        function prosesDaftar() {
            const userIn = document.getElementById('registerUsername').value.trim();
            const passwordIn = document.getElementById('registerPassword').value;
            const confirmation = document.getElementById('registerPasswordConfirm').value;
            if (userIn.length < 3) return bukaDialog('Username minimal 3 karakter.');
            if (!/^[a-zA-Z0-9_.-]+$/.test(userIn)) return bukaDialog('Username hanya boleh berisi huruf, angka, titik, garis bawah, atau tanda hubung.');
            if (passwordIn.length < 6) return bukaDialog('Password minimal 6 karakter.');
            if (passwordIn !== confirmation) return bukaDialog('Konfirmasi password tidak cocok.');
            if (registeredUsers.some(user => user.username.toLowerCase() === userIn.toLowerCase())) return bukaDialog('Username sudah terdaftar. Silakan gunakan username lain.');

            registeredUsers.push({ username: userIn, password: passwordIn });
            localStorage.setItem('faunahaven_accounts', JSON.stringify(registeredUsers));
            currentUser = userIn;
            isAuthenticated = true;
            localStorage.setItem('faunahaven_user', currentUser);
            updateAuthUI();
            tutupModalLogin();
            bukaDialog(`✅ Pendaftaran berhasil. Selamat datang, ${currentUser}!`);
            updateProfilUI();
        }

        function logout() {
            currentUser = null;
            isAuthenticated = false;
            localStorage.removeItem('faunahaven_user');
            updateAuthUI();
            bukaDialog("Keluar akun berhasil.");
            updateProfilUI();
        }

        function klaimLogin() {
            if (!requireLogin('mengklaim reward login')) return;
            document.getElementById('modalLoginReward').style.display = 'none';
            koin += 100; updateCoin();
            bukaDialog("✅ Hari 1 Diklaim! Kamu mendapat +100 Koin.");
        }

        /* PERPINDAHAN TAB / HALAMAN UTAMA */
        function switchTab(tabId, btnElement) {
            document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
            document.querySelectorAll('.top-nav .nav-item').forEach(btn => btn.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            
            if(btnElement) btnElement.classList.add('active');
            else {
                if(tabId === 'home') document.getElementById('btn-nav-home').classList.add('active');
                if(tabId === 'gacha') document.getElementById('btn-nav-gacha').classList.add('active');
                if(tabId === 'ecodex') document.getElementById('btn-nav-ecodex').classList.add('active');
            }

            if(tabId === 'home') kembaliKeHome();
            if(tabId === 'gacha') renderKujiUI();
            if(tabId === 'ecodex') renderEcoDex();
            if(tabId === 'leaderboard') renderLeaderboard();
            if(tabId === 'misi') renderMisi();
            if(tabId === 'faq') renderFAQ();
            if(tabId === 'profil') updateProfilUI();
            window.scrollTo(0,0);
        }

        /* NAVIGASI MENU LAINNYA (GARIS 3) */
        function bukaMenuLainnya() {
            document.getElementById('moreMenuOverlay').style.display = 'flex';
        }
        function tutupMenuLainnya() {
            document.getElementById('moreMenuOverlay').style.display = 'none';
        }
        function pilihMenuLainnya(tabId) {
            tutupMenuLainnya();
            switchTab(tabId, null);
        }

        function tukarKodePromo() {
            if (!requireLogin('menukarkan kode promo')) return;
            document.getElementById('promoCodeInput').value = '';
            document.getElementById('modalPromo').style.display = 'flex';
            setTimeout(() => document.getElementById('promoCodeInput').focus(), 0);
        }

        function tutupModalPromo() {
            document.getElementById('modalPromo').style.display = 'none';
        }

        function prosesTukarKodePromo() {
            let kode = document.getElementById('promoCodeInput').value.trim();
            if (!kode) {
                bukaDialog('Masukkan kode promo terlebih dahulu.');
                return;
            }
            if (kode) {
                if (kode.toUpperCase() === "FAUNA2026") {
                    koin += 1000;
                    updateCoin();
                    tutupModalPromo();
                    bukaDialog("🎉 Selamat! Kode Promo Berhasil Ditukarkan: +1000 Koin!");
                } else {
                    bukaDialog("❌ Kode Promo tidak valid atau sudah kadaluarsa.");
                }
            }
        }

        // --- FEATURE: NAVIGASI PERPINDAHAN BANNER GACHA ---
        function pindahBanner(idBannerTarget, btnEl) {
            document.querySelectorAll('.gacha-nav-btn').forEach(b => b.classList.remove('active'));
            btnEl.classList.add('active');
            document.querySelectorAll('.kuji-board-full').forEach(board => board.classList.remove('active'));
            let target = document.getElementById(idBannerTarget);
            if(target) target.classList.add('active');
        }

        // --- FEATURE: RINCIAN CHANCE GACHA MODAL ---
        function bukaDetailChance(tipe) {
            let box;
            let namaKategori = "";
            if(tipe==='mamalia') { box = boxMamalia; namaKategori = "Mamalia"; }
            else if(tipe==='aves') { box = boxAves; namaKategori = "Aves (Burung)"; }
            else if(tipe==='reptilia') { box = boxReptilia; namaKategori = "Reptilia"; }
            else if(tipe==='pisces') { box = boxPisces; namaKategori = "Pisces (Ikan)"; }
            else if(tipe==='amphibia') { box = boxAmphibia; namaKategori = "Amphibia"; }
            else if(tipe==='invertebrata') { box = boxInvertebrata; namaKategori = "Invertebrata"; }

            document.getElementById('chanceTitle').innerText = `Rincian Box ${namaKategori}`;
            let container = document.getElementById('chanceListContainer');
            container.innerHTML = `<p style="margin-top:0; color:#555;"><b>Sisa Tiket: ${box.sisa} / ${box.total}</b></p>`;

            box.prizes.forEach(p => {
                let chancePercent = box.sisa > 0 ? ((p.stock / box.sisa) * 100).toFixed(1) : 0;
                let rarityClass = p.rarity;
                container.innerHTML += `
                    <div class="chance-item-row">
                        <div>
                            <span style="font-size: 18px; margin-right: 5px;">${p.icon}</span>
                            <b>${p.name}</b>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="chance-badge ${rarityClass}">${p.rarity}</span>
                            <span style="font-weight: bold; color: #1976d2; width: 60px; text-align: right;">${chancePercent}%</span>
                            <span style="color: #777; font-size: 11px;">(${p.stock}/${p.init})</span>
                        </div>
                    </div>`;
            });

            container.innerHTML += `
                <div class="chance-item-row" style="background: #fff3e0; border-radius: 8px; margin-top: 10px; border: 1px solid #ffe0b2;">
                    <div>
                        <span style="font-size: 18px; margin-right: 5px;">${box.lastOne.icon}</span>
                        <b style="color: #d50000;">⭐ LAST ONE: ${box.lastOne.name}</b>
                    </div>
                    <div>
                        <span class="chance-badge MUR">MUR</span>
                        <span style="font-size: 11px; font-weight: bold; color: #d50000; margin-left: 5px;">(Tiket Terakhir)</span>
                    </div>
                </div>`;

            document.getElementById('modalChanceGacha').style.display = 'flex';
        }

        function tutupDetailChance() {
            document.getElementById('modalChanceGacha').style.display = 'none';
        }

        // --- DASHBOARD MATERI ---
        function renderDaftarMateri() {
            ['mamalia', 'aves', 'reptilia', 'pisces', 'amphibia', 'invertebrata'].forEach(kat => {
                let el = document.getElementById(`list-${kat}-edu`);
                if(el) el.innerHTML = '';
            });
            
            modulEdukasi.forEach((modul, index) => {
                let cardHTML = `
                    <div class="module-card" onclick="bacaMateri(${index})">
                        <div class="module-icon">${modul.icon}</div>
                        <div class="module-info">
                            <div class="module-provider">FaunaHeaven Academy · Jurnal Konservasi</div>
                            <h3>${modul.judul}</h3>
                            <p>${modul.deskripsi}</p>
                            <div class="module-tags"><span>📖 Materi</span><span>📝 3 Soal</span><span>⏱ 10 Menit</span></div>
                            <div class="module-meta">★ 4.9 &nbsp; · &nbsp; Materi & kuis</div>
                        </div>
                        <div style="color: #1976d2; font-size:24px;">▶</div>
                    </div>`;
                let target = document.getElementById(`list-${modul.kategori}-edu`);
                if(target) target.innerHTML += cardHTML;
            });
        }
        
        function bacaMateri(index) {
            modulSaatIni = index;
            document.getElementById('main-dashboard').style.display = 'none';
            document.getElementById('quiz-section').style.display = 'none';
            document.getElementById('materi-detail').style.display = 'block';
            document.getElementById('judul-materi').innerText = modulEdukasi[index].judul;
            document.getElementById('isi-materi').innerHTML = modulEdukasi[index].materi;
            window.scrollTo(0,0);

            let btnMulai = document.getElementById('btn-mulai-kuis');
            btnMulai.disabled = true;
            let timeLeft = 10;
            btnMulai.innerText = `Selesai Membaca & Uji Pemahaman (${timeLeft}s)`;
            
            clearInterval(timerAntiCheat);
            timerAntiCheat = setInterval(() => {
                timeLeft--;
                if(timeLeft <= 0) {
                    clearInterval(timerAntiCheat);
                    btnMulai.disabled = false;
                    btnMulai.innerText = `Selesai Membaca & Uji Pemahaman 📝`;
                } else {
                    btnMulai.innerText = `Selesai Membaca & Uji Pemahaman (${timeLeft}s)`;
                }
            }, 1000);
        }

        function kembaliKeHome() {
            clearInterval(timerAntiCheat);
            document.getElementById('main-dashboard').style.display = 'block';
            document.getElementById('materi-detail').style.display = 'none';
            document.getElementById('quiz-section').style.display = 'none';
        }

        // --- SISTEM KUIS MULTIPLE QUESTIONS ---
        function mulaiKuis() {
            if (!requireLogin('mengerjakan kuis dan mendapatkan koin')) return;
            clearInterval(timerAntiCheat);
            currentKuisIndex = 0;
            skorKuis = 0;
            document.getElementById('materi-detail').style.display = 'none';
            document.getElementById('quiz-section').style.display = 'block';
            renderSoal();
            window.scrollTo(0,0);
        }

        function renderSoal() {
            opsiTerpilihIndex = null;
            const modul = modulEdukasi[modulSaatIni];
            const soal = modul.kuis[currentKuisIndex];
            
            document.getElementById('soal-counter').innerText = currentKuisIndex + 1;
            document.getElementById('soal-total').innerText = modul.kuis.length;
            document.getElementById('teks-soal').innerText = soal.pertanyaan;
            
            const opsiContainer = document.getElementById('opsi-container');
            opsiContainer.innerHTML = ''; 
            soal.opsi.forEach((teks, index) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option'; btn.innerText = teks;
                btn.onclick = () => { 
                    if(document.getElementById('btn-submit').style.display === 'none' && document.getElementById('quiz-msg').style.display === 'block') return;
                    opsiTerpilihIndex = index; 
                    document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected')); 
                    btn.classList.add('selected'); 
                };
                opsiContainer.appendChild(btn);
            });

            document.getElementById('btn-submit').style.display = 'inline-block';
            document.getElementById('btn-submit').disabled = false;
            document.getElementById('btn-lanjut-soal').style.display = 'none';
            document.getElementById('btn-selesai').style.display = 'none';
            document.getElementById('quiz-msg').style.display = 'none';
        }

        function submitJawaban() {
            if (!requireLogin('mengirim jawaban kuis')) return;
            if (opsiTerpilihIndex === null) { bukaDialog("Pilih jawaban dulu!"); return; }
            const modul = modulEdukasi[modulSaatIni];
            const soal = modul.kuis[currentKuisIndex];
            
            const opsiBtns = document.querySelectorAll('.quiz-option');
            opsiBtns.forEach(b => b.disabled = true);
            document.getElementById('btn-submit').style.display = 'none';

            let msgEl = document.getElementById('quiz-msg');
            if (opsiTerpilihIndex === soal.jawabanBenar) {
                opsiBtns[opsiTerpilihIndex].classList.add('correct'); 
                skorKuis++;
                msgEl.innerHTML = "✅ Benar!"; 
                msgEl.style.color = "#2e7d32"; msgEl.style.background = "#e8f5e9";
            } else {
                opsiBtns[opsiTerpilihIndex].classList.add('wrong'); 
                opsiBtns[soal.jawabanBenar].classList.add('correct');
                msgEl.innerHTML = "❌ Salah."; 
                msgEl.style.color = "#c62828"; msgEl.style.background = "#ffebee";
            }
            msgEl.style.display = 'block';

            if (currentKuisIndex < modul.kuis.length - 1) {
                document.getElementById('btn-lanjut-soal').style.display = 'inline-block';
            } else {
                const koinJawabanBenar = skorKuis * 100;
                const bonusSelesaiKuis = 100;
                const koinDapat = koinJawabanBenar + bonusSelesaiKuis;
                koin += koinDapat; updateCoin();
                
                msgEl.innerHTML += `<br><br><div style="text-align:center;"><b>Kuis Selesai!</b><br>Skor Benar: ${skorKuis}/${modul.kuis.length}<br>Reward: +${koinDapat} Koin 🪙</div>`;
                bukaDialog('Kuis selesai! 🎉', `Skor benar: ${skorKuis}/${modul.kuis.length}\nReward jawaban benar: +${koinJawabanBenar} 🪙\nBonus menyelesaikan kuis: +${bonusSelesaiKuis} 🪙`);
                document.getElementById('btn-selesai').style.display = 'inline-block';
                
                if(questProgress < 2 && !questClaimed) {
                    questProgress++;
                    document.getElementById('quest-progress').innerText = questProgress + '/2';
                    document.getElementById('quest-bar').style.width = (questProgress*50) + '%';
                    if(questProgress === 2) {
                        questClaimed = true; koin += 500; updateCoin();
                        bukaDialog('Misi harian selesai! 🎉', 'Kamu mendapat bonus tambahan +500 🪙.');
                    }
                }
            }
        }
        
        function lanjutSoal() {
            currentKuisIndex++;
            renderSoal();
        }

        // --- ECOKUJI UI ---
        function renderKujiUI() {
            ['mamalia', 'aves', 'reptilia', 'pisces', 'amphibia', 'invertebrata'].forEach(t => {
                let box;
                if(t==='mamalia') box=boxMamalia; else if(t==='aves') box=boxAves; else if(t==='reptilia') box=boxReptilia; else if(t==='pisces') box=boxPisces; else if(t==='amphibia') box=boxAmphibia; else if(t==='invertebrata') box=boxInvertebrata;
                
                document.getElementById(`sisa-${t}`).innerText = box.sisa; 
                document.getElementById(`bar-${t}`).style.width = (box.sisa/box.total*100)+'%';
            });
        }

        // --- GACHA PULL ---
        function tarikKuji(tipe, jumlah) {
            if (!requireLogin('menarik EcoKuji')) return;
            let biaya = jumlah * 100; 
            let box;
            if(tipe==='mamalia') box=boxMamalia; else if(tipe==='aves') box=boxAves; else if(tipe==='reptilia') box=boxReptilia; else if(tipe==='pisces') box=boxPisces; else if(tipe==='amphibia') box=boxAmphibia; else if(tipe==='invertebrata') box=boxInvertebrata;
            
            if (koin < biaya) return bukaDialog("Koin kurang!"); if (box.sisa < jumlah) return bukaDialog(`Sisa tiket ${box.sisa}. Harap reset box atau tarik secukupnya.`);
            koin -= biaya; updateCoin(); document.querySelectorAll('.roll-btn').forEach(b => b.disabled = true);
            let arr = []; pendingLastOne = null;
            for(let i=0; i<jumlah; i++){
                let p_idx = Math.floor(Math.random() * box.sisa); let kum = 0; let hasil = null;
                for(let p of box.prizes) { if(p.stock>0) { kum+=p.stock; if(p_idx<kum) { hasil=p; p.stock--; break; } } }
                arr.push(hasil); box.sisa--; if(box.sisa===0) pendingLastOne = {...box.lastOne};
            }
            renderKujiUI();
            if(jumlah===1) { kartuTahan = {...arr[0]}; popup1x(box, arr[0]); } else popup10x(arr);
        }

        function popup1x(box, h) {
            let pop = document.getElementById('popupGacha1x'), boxEl = document.getElementById('gachaPopupBox'), acts = document.getElementById('dupActions'), cls = document.getElementById('btnTutupPopup');
            acts.style.display = 'none'; cls.style.display = 'none'; pop.style.display = 'flex'; boxEl.classList.add('is-rolling');
            document.getElementById('popupTitle').innerText = 'Memutar...'; document.getElementById('popupIcon').innerText = '❓'; document.getElementById('popupRarity').innerText = '???'; document.getElementById('popupRarity').className = `rarity UNKNOWN`; document.getElementById('popupName').innerText = '';
            
            let isDup = koleksi.some(k => k.name === h.name);
            let icons = box.prizes.map(p=>p.icon);
            let intv = setInterval(() => document.getElementById('popupIcon').innerText = icons[Math.floor(Math.random()*icons.length)], 100);

            setTimeout(() => {
                clearInterval(intv); boxEl.classList.remove('is-rolling');
                document.getElementById('popupTitle').innerText = `PRIZE ${h.tier}!`; document.getElementById('popupIcon').innerText = h.icon; document.getElementById('popupRarity').innerText = h.rarity; document.getElementById('popupRarity').className = `rarity ${h.rarity}`; document.getElementById('popupName').innerText = h.name;
                if(isDup) acts.style.display = 'flex'; else { kartuTahan.qty=1; koleksi.push(kartuTahan); cls.style.display = 'block'; }
            }, 1500);
        }
        function prosesDuplikat1x(p) {
            if (!requireLogin('mengelola hasil EcoKuji')) return;
            if(p==='konversi') koin+=100; else { let i = koleksi.findIndex(k=>k.name===kartuTahan.name); koleksi[i].qty++; }
            updateCoin(); tutupPopupGacha1x();
        }
        function tutupPopupGacha1x() { document.getElementById('popupGacha1x').style.display = 'none'; document.querySelectorAll('.roll-btn').forEach(b => b.disabled = false); cekLast(); renderEcoDex(); }

        function popup10x(arr) {
            hasilGacha10x = arr; let pop = document.getElementById('popupGacha10x'), grid = document.getElementById('grid10xContainer'), acts = document.getElementById('actions10x');
            grid.innerHTML = ''; document.getElementById('title10x').innerText = 'Memutar 10x...'; acts.style.display = 'none';
            
            arr.forEach((h, i) => {
                let border = '#ccc'; if(h.rarity==='MUR') border = '#d50000'; else if(h.rarity==='UR') border = '#d50000'; else if(h.rarity==='SSR') border = '#f57f17'; else if(h.rarity==='SR') border = '#4a148c'; else if(h.rarity==='R') border = '#0d47a1';
                grid.innerHTML += `<div class="item-10x" id="i10-${i}" style="border-color:${border}"><div class="icon-10x">${h.icon}</div><div class="rarity-10x ${h.rarity}">${h.rarity}</div></div>`;
            });
            pop.style.display = 'flex';
            arr.forEach((h, i) => {
                setTimeout(() => { document.getElementById(`i10-${i}`).classList.add('show'); if(i === arr.length-1) setTimeout(() => { document.getElementById('title10x').innerText = 'Hasil 10x!'; acts.style.display = 'flex'; }, 600); }, 300 * (i+1));
            });
        }
        function proses10x(p) {
            if (!requireLogin('menyimpan atau mengonversi hasil EcoKuji')) return;
            let k_c=0, s_c=0;
            if(p==='simpan') { hasilGacha10x.forEach(h => { let idx=koleksi.findIndex(k=>k.name===h.name); if(idx!==-1) koleksi[idx].qty++; else koleksi.push({...h, qty:1}); s_c++; }); bukaDialog(`📥 Semua ${s_c} item disimpan.`); }
            else { hasilGacha10x.forEach(h => { let idx=koleksi.findIndex(k=>k.name===h.name); if(idx!==-1) { k_c++; koin+=100; } else { koleksi.push({...h, qty:1}); s_c++; } }); bukaDialog(`♻️ Selesai!\n📥 ${s_c} kartu baru disimpan.\n🪙 ${k_c} kartu duplikat dikonversi menjadi ${k_c*100} Koin.`); }
            updateCoin(); document.getElementById('popupGacha10x').style.display = 'none'; document.querySelectorAll('.roll-btn').forEach(b => b.disabled = false); cekLast(); renderEcoDex();
        }
        function cekLast() {
            if (pendingLastOne && requireLogin('mengambil hadiah terakhir')) {
                bukaDialog(`🎉 LAST ONE PRIZE!\n⭐ ${pendingLastOne.name} (MUR)`);
                let i=koleksi.findIndex(k=>k.name===pendingLastOne.name);
                if(i!==-1) koleksi[i].qty++; else koleksi.push({...pendingLastOne, qty:1});
                pendingLastOne=null; renderEcoDex();
            }
        }

        // --- FAUNADEX ENSIKLOPEDIA (DENGAN SORTING 36 SATWA) ---
        function renderEcoDex() {
            const grid = document.getElementById('collection-grid'); grid.innerHTML = ''; let unlockCount = 0;
            
            let displayItems = masterSatwa.map(satwa => {
                let foundIndex = koleksi.findIndex(k => k.name === satwa.name);
                let found = foundIndex !== -1 ? koleksi[foundIndex] : null;
                if (found) unlockCount++;
                return { ...satwa, isUnlocked: !!found, qty: found ? found.qty : 0, obtainedAt: foundIndex };
            });

            const sortType = document.getElementById('sortFilter').value;
            displayItems.sort((a, b) => {
                if (sortType === 'newest') { if (a.isUnlocked !== b.isUnlocked) return b.isUnlocked - a.isUnlocked; return b.obtainedAt - a.obtainedAt; }
                if (sortType === 'oldest') { if (a.isUnlocked !== b.isUnlocked) return b.isUnlocked - a.isUnlocked; return a.obtainedAt - b.obtainedAt; }
                if (sortType === 'rarity_desc') { return rarityWeight[b.rarity] - rarityWeight[a.rarity]; }
                if (sortType === 'rarity_asc') { return rarityWeight[a.rarity] - rarityWeight[b.rarity]; }
            });

            document.getElementById('collection-progress').innerText = `Progres: ${unlockCount}/36 Satwa`;

            displayItems.forEach(item => {
                if (item.isUnlocked) {
                    let b = '#9e9e9e'; if(item.rarity==='MUR') b='#d50000'; else if(item.rarity==='UR') b='#d50000'; else if(item.rarity==='SSR') b='#f57f17'; else if(item.rarity==='SR') b='#4a148c'; else if(item.rarity==='R') b='#0d47a1';
                    grid.innerHTML += `
                        <div class="card-item" style="border-color:${b}" onclick="bukaEnsiklopedia('${item.name}')">
                            <div class="qty-badge">Qty: ${item.qty}</div>
                            <div style="font-size: 35px; margin: 10px 0;">${item.icon}</div>
                            <h4 style="margin:5px 0; font-size:12px;">${item.name}</h4>
                            <div class="rarity ${item.rarity}">${item.rarity}</div>
                            ${item.qty > 1 ? `<button class="btn-gift" onclick="event.stopPropagation(); kirimHadiah('${item.name}')">🎁 Gift</button>` : ''}
                        </div>`;
                } else {
                    grid.innerHTML += `<div class="card-item locked"><div style="font-size: 35px; margin: 10px 0;">❓</div><h4 style="margin:5px 0; font-size:12px;">Unknown</h4><div class="rarity ${item.rarity}" style="visibility:hidden;">${item.rarity}</div></div>`;
                }
            });
        }

        function bukaEnsiklopedia(nama) {
            let satwa = masterSatwa.find(s => s.name === nama); if(!satwa) return;
            document.getElementById('encycIcon').innerText = satwa.icon; document.getElementById('encycName').innerText = satwa.name; document.getElementById('encycRarity').innerText = satwa.rarity; document.getElementById('encycRarity').className = `rarity ${satwa.rarity}`;
            document.getElementById('encycFakta').innerText = satwa.fakta; document.getElementById('encycHabitat').innerText = satwa.habitat; document.getElementById('encycAncaman').innerText = satwa.ancaman; document.getElementById('encycStatus').innerText = satwa.status;
            
            let bg = '#333'; if(satwa.rarity==='MUR') bg='linear-gradient(45deg, #ff4081, #d50000)'; else if(satwa.rarity==='UR') bg='#d50000'; else if(satwa.rarity==='SSR') bg='#f57f17'; else if(satwa.rarity==='SR') bg='#4a148c'; else if(satwa.rarity==='R') bg='#0d47a1';
            document.getElementById('encycHeader').style.background = bg; 
            document.getElementById('modalEnsiklopedia').style.display = 'flex';
        }
        function tutupEnsiklopedia() { document.getElementById('modalEnsiklopedia').style.display = 'none'; }

        function kirimHadiah(namaHewan) {
            if (!requireLogin('mengirim hadiah')) return;
            bukaInputDialog('Kirim hadiah', `Kirim ${namaHewan} ke username:`, 'Masukkan username penerima', user => {
            if (user && user.trim() !== "") {
                let idx = koleksi.findIndex(i => i.name === namaHewan);
                if (koleksi[idx].qty > 1) { 
                    koleksi[idx].qty--; let info = masterSatwa.find(s => s.name === namaHewan);
                    bukaDialog(`🎁 Sukses dikirim ke '${user}'.\n\nPesan Edukasi Terkirim:\n"Tahukah kamu? ${info.fakta}"`); renderEcoDex(); 
                }
            }
            });
        }

        // --- LEADERBOARD ---
        function renderLeaderboard() {
            let uniqueCount = 0;
            masterSatwa.forEach(satwa => { if (koleksi.find(k => k.name === satwa.name)) uniqueCount++; });
            
            let myIndex = dbPeringkat.findIndex(u => u.id === "me");
            dbPeringkat[myIndex].koleksiUnik = uniqueCount;
            dbPeringkat[myIndex].koin = koin;
            dbPeringkat.sort((a, b) => b.koleksiUnik - a.koleksiUnik || b.koin - a.koin);

            const listContainer = document.getElementById('leaderboard-list');
            listContainer.innerHTML = '';
            
            dbPeringkat.forEach((user, index) => {
                let rankClass = index === 0 ? 'rank-1' : (index === 1 ? 'rank-2' : (index === 2 ? 'rank-3' : ''));
                let isMe = user.id === "me" ? "me" : "";
                let medali = index === 0 ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : `#${index + 1}`));
                
                listContainer.innerHTML += `
                    <div class="rank-card ${isMe} ${rankClass}">
                        <div class="rank-pos">${medali}</div>
                        <div style="font-size: 35px;">${user.avatar}</div>
                        <div class="rank-info">
                            <h4>${user.nama}</h4>
                            <p>Konservator Handal</p>
                        </div>
                        <div class="rank-stats">
                            <div class="koleksi-stat">${user.koleksiUnik}/36 Satwa</div>
                            <div class="koin-stat">${user.koin} 🪙</div>
                        </div>
                    </div>`;
            });
        }

        window.onload = () => { 
            applySavedTheme(); updateAuthUI(); renderDaftarMateri(); renderCourseChips(); renderCourses(); renderMisi(); renderFAQ(); updateCoin(); renderKujiUI(); renderEcoDex();
            document.querySelectorAll('.more-menu-item').forEach(item => {
                const label = item.innerText;
                if (label.includes('Misi & Tantangan')) item.onclick = () => pilihMenuLainnya('misi');
                if (label.includes('Bantuan & FAQ')) item.onclick = () => pilihMenuLainnya('faq');
            });
            if (isAuthenticated) setTimeout(() => { document.getElementById('modalLoginReward').style.display = 'flex'; }, 500);
        }

