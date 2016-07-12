## Tugas Pemograman Web

app ini terhubung dengan twitter yang berfungsi untuk mengurutkan dan mendokumentasi tweet.
tweet bisa disortir dan diberi kategori sesuai kebutuhan.
tweet yang diambil merupakan tweet yang difavorit secara default tetapi anda juga bisa mengambil tweet yang tidak difavoritkan.

sebelum menjalankan pastikan terlebih dahulu "Redis" sudah diinstall 
untuk menginstall kunjungi  http://redis.io/download

kemudian install dependensi yang diperlukan dengan perintah :

npm install -g grunt
npm install -g grunt-cli
npm install

lalu menjalankan redis server dengan perintah :

redis-server

dan menjalankan aplikasi dengan perintah:

grunt

dan buka pada http://localhost:3000

untuk penggunaan anda harus memakai consumerKey, consumerSecret, accessToken, accessTokenSecret & callBackUrl anda sendiri yang bisa anda dapatkan setelah mendaftar ke:

https://dev.twitter.com/user/login?destination=home

lalu pada bagian https://dev.twitter.com/apps buatlah app baru dan ikuti langkah-langkahnya (setelah mengikuti langkah-langkahnya anda akan mendapatkan hal yang disebutkan diatas)
