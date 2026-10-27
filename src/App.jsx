import React, { useState } from 'react';

const services = [
  { number: '01', title: 'Car Service & Repair', text: 'Reliable maintenance and repairs to keep every journey running smoothly.', icon: '⚙' },
  { number: '02', title: 'Battery & Electrical', text: 'Battery checks, replacements and electrical diagnostics you can trust.', icon: 'ϟ' },
  { number: '03', title: 'Brake & Suspension', text: 'Responsive braking and a comfortable ride, checked by experienced hands.', icon: '◉' },
  { number: '04', title: 'Accessories & Care', text: 'Thoughtful upgrades and quality products to make your car your own.', icon: '✦' },
];

const brands = ['BMW', 'AUDI', 'MERCEDES-BENZ', 'VOLKSWAGEN', 'HONDA', 'HYUNDAI', 'FORD', 'SKODA'];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light');
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.body.classList.toggle('dark-theme', next);
  };

  return (
    <div className={dark ? 'site dark' : 'site'}>
      <header className="header">
        <a className="brand" href="#home" aria-label="BG Cars home"><span className="brand-mark">BG</span><span><b>BG CARS</b><small>BAYVIEW GARAGE</small></span></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">☰</button>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About Us</a>
          <a href="#brands" onClick={() => setMenuOpen(false)}>Brands</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <div className="header-actions"><button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle colour theme">{dark ? '☼' : '☾'}</button><a className="button button-small" href="#contact">Book a service <span>↗</span></a></div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-grid"></div>
          <div className="hero-content">
            <div className="eyebrow"><span className="pulse"></span> YOUR TRUSTED AUTOMOTIVE PARTNER</div>
            <h1>Every mile.<br />A little more <em>confidence.</em></h1>
            <p>Expert car care, dependable repairs and quality accessories — all under one roof.</p>
            <div className="hero-actions"><a className="button" href="#services">Explore our services <span>↗</span></a><a className="text-link" href="#about">Discover BG Cars <span>→</span></a></div>
            <div className="hero-stats"><div><strong>01</strong><span>Care-first approach</span></div><div><strong>360°</strong><span>Automotive solutions</span></div><div><strong>100%</strong><span>Focus on quality</span></div></div>
          </div>
          <div className="hero-visual" aria-label="Stylized car illustration"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="visual-tag tag-top">BUILT AROUND YOUR DRIVE</div><svg className="car-art" viewBox="0 0 680 300" role="img" aria-label="Illustration of a modern sports car"><defs><linearGradient id="carPaint" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#dff7ff"/><stop offset="45%" stopColor="#19a8d9"/><stop offset="100%" stopColor="#07618e"/></linearGradient></defs><ellipse cx="345" cy="250" rx="260" ry="22" fill="#00b6dc" opacity=".18"/><path d="M82 205 L110 164 Q128 151 188 144 L254 91 Q278 72 325 72 L422 80 Q454 85 486 122 L548 148 Q581 160 590 191 L578 218 L95 224 Z" fill="url(#carPaint)" stroke="#6dd9f4" strokeWidth="3"/><path d="M219 143 L273 97 Q290 87 326 88 L365 92 L365 143 Z" fill="#10283b" stroke="#8dddf0" strokeWidth="3"/><path d="M379 93 L419 98 Q444 102 467 132 L379 143 Z" fill="#10283b" stroke="#8dddf0" strokeWidth="3"/><path d="M113 170 L184 158 L165 184 L101 192 Z" fill="#e8fbff"/><path d="M488 153 L548 169 L565 188 L512 182 Z" fill="#fff2c8"/><path d="M189 202 L485 202" stroke="#d5f6ff" strokeWidth="3" opacity=".65"/><circle cx="199" cy="218" r="42" fill="#101923" stroke="#8bdcf3" strokeWidth="5"/><circle cx="199" cy="218" r="22" fill="#263d4c" stroke="#d2f5ff" strokeWidth="5"/><circle cx="199" cy="218" r="6" fill="#8bdcf3"/><circle cx="481" cy="218" r="42" fill="#101923" stroke="#8bdcf3" strokeWidth="5"/><circle cx="481" cy="218" r="22" fill="#263d4c" stroke="#d2f5ff" strokeWidth="5"/><circle cx="481" cy="218" r="6" fill="#8bdcf3"/></svg><div className="visual-tag tag-bottom"><span>✦</span> CARE THAT GOES FURTHER</div><div className="visual-caption">PRECISION <b>·</b> PERFORMANCE <b>·</b> PEACE OF MIND</div></div>
        </section>

        <section className="trust-strip"><span>THE RIGHT CARE FOR YOUR CAR</span><div className="trust-line"></div><span>MAINTENANCE</span><span>REPAIRS</span><span>ACCESSORIES</span></section>

        <section className="section services" id="services">
          <div className="section-heading"><div><div className="eyebrow">WHAT WE DO</div><h2>Good care makes<br /><em>every drive better.</em></h2></div><p>From routine check-ups to the details that make your car yours, we help you take the road with confidence.</p></div>
          <div className="service-grid">{services.map(s => <article className="service-card" key={s.number}><div className="service-top"><span className="service-icon">{s.icon}</span><span className="service-number">{s.number}</span></div><h3>{s.title}</h3><p>{s.text}</p><a href="#contact" className="card-link" aria-label={'Enquire about ' + s.title}>Explore service <span>↗</span></a></article>)}</div>
        </section>

        <section className="about" id="about"><div className="about-art"><div className="about-ring"></div><div className="about-card"><span className="about-card-mark">BG</span><span>CARE IS IN THE DETAILS.</span></div><div className="about-index">EST. FOR EVERY JOURNEY</div></div><div className="about-copy"><div className="eyebrow">A BETTER KIND OF GARAGE</div><h2>It's not just about<br />the car. It's about<br /><em>how you feel driving it.</em></h2><p>At BG Cars, we believe good automotive care should feel straightforward. Clear communication, careful work and solutions that make sense for your vehicle — that's what we aim to deliver every day.</p><a href="#contact" className="button">Let's talk about your car <span>↗</span></a></div></section>

        <section className="section brands" id="brands"><div className="section-heading"><div><div className="eyebrow">MADE FOR YOUR MOTOR</div><h2>Different badges.<br /><em>One standard of care.</em></h2></div><p>We work with a wide range of vehicles and help you find the right care and accessories for your needs.</p></div><div className="brand-list">{brands.map((brand, i) => <div className="brand-item" key={brand}><span className="brand-symbol">{['✦','◈','◎','W','H','H','F','Š'][i]}</span><span>{brand}</span></div>)}</div></section>

        <section className="contact" id="contact"><div><div className="eyebrow">YOUR NEXT JOURNEY STARTS HERE</div><h2>Let's get your car<br /><em>feeling right.</em></h2><p>Have a question or need help with your vehicle? Reach out to the BG Cars team.</p></div><div className="contact-panel"><span className="contact-kicker">GET IN TOUCH</span><h3>Tell us what you need.</h3><p>Contact us to discuss servicing, repairs or accessories for your car.</p><a className="button" href="mailto:hello@bgcars.example?subject=BG%20Cars%20Enquiry">Send an enquiry <span>↗</span></a><small>Replace this demo email with the official BG Cars contact address.</small></div></section>
      </main>
      <footer className="footer"><a className="brand" href="#home"><span className="brand-mark">BG</span><span><b>BG CARS</b><small>BAYVIEW GARAGE</small></span></a><span>Automotive care, with confidence.</span><a href="#home">Back to top ↑</a><small>© {new Date().getFullYear()} BG Cars. Reconstructed source version.</small></footer>
    </div>
  );
}
