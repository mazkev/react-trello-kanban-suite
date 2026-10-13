/**
 * High-Performance HTTP Load Testing Script
 * Target: https://trello-azure-five.vercel.app/
 */

const TARGET_URL = process.argv[2] || 'https://trello-azure-five.vercel.app/';
const CONCURRENCY = parseInt(process.argv[3] || '50', 10);
const DURATION_SEC = parseInt(process.argv[4] || '10', 10);

console.log('='.repeat(65));
console.log('🚀 MEMULAI LOAD TESTING PRODUKSI VERCEL');
console.log('='.repeat(65));
console.log(`📍 Target URL     : ${TARGET_URL}`);
console.log(`👥 Concurrent User : ${CONCURRENCY} koneksi simultan`);
console.log(`⏱️  Durasi Uji     : ${DURATION_SEC} detik`);
console.log('='.repeat(65));
console.log('Sedang menjalankan simulasi lalu lintas...');

const startTime = Date.now();
const endTime = startTime + DURATION_SEC * 1000;

let totalRequests = 0;
let successCount = 0;
let errorCount = 0;
const statusCodes = {};
const latencies = [];

async function worker() {
  while (Date.now() < endTime) {
    const reqStart = performance.now();
    try {
      const res = await fetch(TARGET_URL, {
        headers: {
          'User-Agent': 'KanbanSuite-LoadTest/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      const reqDuration = performance.now() - reqStart;
      latencies.push(reqDuration);
      totalRequests++;

      statusCodes[res.status] = (statusCodes[res.status] || 0) + 1;
      if (res.ok) {
        successCount++;
      } else {
        errorCount++;
      }
    } catch (err) {
      const reqDuration = performance.now() - reqStart;
      latencies.push(reqDuration);
      totalRequests++;
      errorCount++;
      statusCodes['ERR'] = (statusCodes['ERR'] || 0) + 1;
    }
  }
}

// Jalankan pool of concurrent workers
const workers = [];
for (let i = 0; i < CONCURRENCY; i++) {
  workers.push(worker());
}

await Promise.all(workers);

const actualDurationSec = (Date.now() - startTime) / 1000;
latencies.sort((a, b) => a - b);

const p = (pct) => {
  if (latencies.length === 0) return 0;
  const idx = Math.min(Math.floor((pct / 100) * latencies.length), latencies.length - 1);
  return latencies[idx].toFixed(2);
};

const meanLatency = latencies.length > 0 
  ? (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2) 
  : 0;
const rps = (totalRequests / actualDurationSec).toFixed(2);

console.log('\n' + '='.repeat(65));
console.log('📊 HASIL PENGUJIAN BEBAN (LOAD TEST RESULTS)');
console.log('='.repeat(65));
console.log(`✅ Total Request Dilayani : ${totalRequests.toLocaleString()} requests`);
console.log(`⏱️  Durasi Nyata           : ${actualDurationSec.toFixed(2)} detik`);
console.log(`⚡ Throughput (RPS)       : ${rps} requests/detik`);
console.log(`🎉 Tingkat Keberhasilan    : ${((successCount / totalRequests) * 100).toFixed(2)}% (${successCount} OK)`);
console.log(`❌ Request Gagal          : ${errorCount} errors`);

console.log('\n📈 DISTRIBUSI LATENCY (RESPON SPEED):');
console.log(`   - Min Latency (Tercepat) : ${latencies[0]?.toFixed(2) || 0} ms`);
console.log(`   - Median / P50           : ${p(50)} ms`);
console.log(`   - P90                    : ${p(90)} ms`);
console.log(`   - P95                    : ${p(95)} ms`);
console.log(`   - P99                    : ${p(99)} ms`);
console.log(`   - Max Latency (Terlambat): ${latencies[latencies.length - 1]?.toFixed(2) || 0} ms`);
console.log(`   - Rata-rata (Mean)       : ${meanLatency} ms`);

console.log('\n🏷️  KODE STATUS HTTP:');
for (const [code, count] of Object.entries(statusCodes)) {
  console.log(`   - HTTP ${code}: ${count} (${((count / totalRequests) * 100).toFixed(1)}%)`);
}

console.log('='.repeat(65));
if (errorCount === 0 && parseFloat(rps) > 10) {
  console.log('🏆 KESIMPULAN: PERFORMA SANGAT BAIK! Server Vercel stabil & tahan beban.');
} else {
  console.log('⚠️  KESIMPULAN: Terdapat beberapa kendala latensi atau kegagalan koneksi.');
}
console.log('='.repeat(65));
