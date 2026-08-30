export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <header className="px-6 py-12 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🐱</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meow World
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            บ้านสำหรับสัตว์เลี้ยงทุกชนิด
            <br />
            <span className="text-orange-500">เก็บความทรงจำ ไม่ใช่แค่ข้อมูล</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition"
            >
              เริ่มต้นใช้งานฟรี
            </a>
            <a
              href="#features"
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-bold hover:border-gray-400 transition"
            >
              ดูฟีเจอร์ทั้งหมด
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ทำไมต้อง Meow World?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📋"
              title="Passport"
              description="สร้างพาสปอร์ตให้สัตว์เลี้ยง พร้อมใบรับรองสุขภาพ"
            />
            <FeatureCard
              icon="📸"
              title="Life Journey"
              description="บันทึกทุกช่วงเวลาสำคัญ ตั้งแต่วันแรกที่เจอกัน"
            />
            <FeatureCard
              icon="🏠"
              title="Home"
              description="บ้านสำหรับสัตว์เลี้ยงทุกตัว อยู่ร่วมกันภายใต้หลังคาเดียว"
            />
            <FeatureCard
              icon="👨‍👩‍👧‍👦"
              title="Family"
              description="แชร์ให้ครอบครัว ดูแลสัตว์เลี้ยงด้วยกัน"
            />
            <FeatureCard
              icon="🪺"
              title="Nest"
              description="รังส่วนตัวสำหรับแต่ละตัว ตกแต่งตามสไตล์ของตัวเอง"
            />
            <FeatureCard
              icon="🐾"
              title="Multi-Species"
              description="รองรับทุกชนิด แมว สุนัข นก กระต่าย และอื่นๆ"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-orange-500 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            พร้อมเก็บความทรงจำ了吗?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            เริ่มต้นฟรี ไม่มีค่าใช้จ่าย
          </p>
          <a
            href="/login"
            className="bg-white text-orange-500 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition inline-block"
          >
            เริ่มต้นใช้งานเลย
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-gray-500 text-sm">
        <p>© 2026 Meow World. สร้างด้วย ❤️ สำหรับสัตว์เลี้ยงทุกตัว</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
