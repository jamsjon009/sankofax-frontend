export default function MissionVisionSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-8 border-l-4 border-primary-600">
          <h2 className="text-xl font-bold text-charcoal mb-3">Our Mission</h2>
          <p className="text-muted text-sm leading-relaxed">
            To build the most comprehensive and trusted global directory of Black and African-owned businesses, empowering entrepreneurs to reach a worldwide audience while helping consumers make intentional purchasing decisions that strengthen the diaspora economy.
          </p>
        </div>
        <div className="card p-8 border-l-4 border-accent-500">
          <h2 className="text-xl font-bold text-charcoal mb-3">Our Vision</h2>
          <p className="text-muted text-sm leading-relaxed">
            A thriving global ecosystem where Black and African-owned businesses are visible, supported, and celebrated &mdash; where the diaspora community can find, trust, and invest in businesses that reflect their values and heritage.
          </p>
        </div>
      </div>
    </section>
  )
}