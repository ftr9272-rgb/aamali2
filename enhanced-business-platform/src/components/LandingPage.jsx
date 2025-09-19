import React, { useEffect } from 'react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted, onGoToMarketplace, onGetStartedWithRole }) => {

  useEffect(() => {
    // Load Bootstrap CSS
    if (!document.querySelector('link[href*="bootstrap"]')) {
      const link = document.createElement('link');
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    // Load Bootstrap Icons
    if (!document.querySelector('link[href*="bootstrap-icons"]')) {
      const link = document.createElement('link');
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    // Load Google Fonts
    if (!document.querySelector('link[href*="Cairo"]')) {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    // Load AOS
    if (!document.querySelector('link[href*="aos"]')) {
      const link = document.createElement('link');
      link.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
      script.onload = () => {
        if (window.AOS) {
          window.AOS.init({
            duration: 1000,
            once: true
          });
        }
      };
      document.head.appendChild(script);
    }

    // Load Bootstrap JS
    if (!document.querySelector('script[src*="bootstrap"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
      document.head.appendChild(script);
    }

    // Counter Animation
    const initCounters = () => {
      const counters = document.querySelectorAll('.stat-number');
      const speed = 200;
      const countUp = (counter) => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          setTimeout(() => countUp(counter), 10);
        } else {
          counter.innerText = target;
        }
      };

      // Intersection Observer for counters
      const observerOptions = {
        threshold: 0.7
      };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            countUp(counter);
            observer.unobserve(counter);
          }
        });
      }, observerOptions);
      counters.forEach(counter => {
        observer.observe(counter);
      });
    };

    // Initialize counters after a short delay
    setTimeout(initCounters, 500);

    // Navbar scroll effect
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.padding = '0.5rem 0';
          navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
          navbar.style.padding = '1rem 0';
          navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const stats = [
    { value: "5000", label: "مورد سلس" },
    { value: "25000", label: "صفقة سلسة" },
    { value: "98", label: "% رضا العملاء" },
    { value: "40", label: "% توفير في التكاليف" }
  ];

  const features = [
    {
      icon: "bi-box-seam",
      title: "للموردين",
      description: "وصول لآلاف التجار، إدارة سهلة للطلبات، وتحليلات دقيقة للعرض والطلب"
    },
    {
      icon: "bi-shop",
      title: "لتجار التجزئة",
      description: "مصادر متنوعة للمنتجات، أسعار تنافسية، وتتبع كامل للطلبات والشحنات"
    },
    {
      icon: "bi-truck",
      title: "لشركات الشحن",
      description: "وصول لطلبات شحن مستمرة، إدارة ذكية للأسطول، وتحسين كفاءة التشغيل"
    }
  ];

  const steps = [
    {
      number: "1",
      icon: "bi-person-plus",
      title: "سجل حسابك",
      description: "انضم كأحد الأطراف الثلاثة وابدأ رحلتك التجارية السلسة"
    },
    {
      number: "2",
      icon: "bi-search",
      title: "اكتشف الفرص",
      description: "تصفح الفرص التجارية السلسة وابحث عن الشركاء المثاليين"
    },
    {
      number: "3",
      icon: "bi-handshake",
      title: "ابدأ التعاون",
      description: "أغلق الصفقات، تتبع الشحنات، واستمتع بتجارة سلسة"
    }
  ];

  const testimonials = [
    {
      content: "3 سلاسة غيّرت طريقة عملنا تماماً. زادت مبيعاتنا بنسبة 60% بفضل سهولة الاستخدام!",
      author: "أحمد خالد",
      position: "مدير شركة التجزئة XYZ",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    {
      content: "أفضل منصة للربط بين الأطراف الثلاثة. كل شيء سلس وسهل، وفرت علينا الكثير من الوقت.",
      author: "فاطمة محمد",
      position: "مديرة التوريد في TechSource",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    {
      content: "نظام الشحن في 3 سلاسة سهّل إدارة عملياتنا بشكل كبير. نوصي بها بشدة!",
      author: "خالد سالم",
      position: "مدير عمليات FastShip",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  ];

  return (
    <div className="landing-page" dir="rtl">
      {/* Navigation - Completely Rewritten for Maximum Visibility */}
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.15)',
          padding: '1rem 0',
          zIndex: 9999,
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <div 
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Brand Logo */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div 
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#ff6f00',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold'
              }}
            >
              3
            </div>
            <span 
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1a237e',
                fontFamily: 'Cairo, sans-serif'
              }}
            >
              منصة تجارتنا
            </span>
          </div>

          {/* Desktop Navigation Menu */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            className="d-none d-lg-flex"
          >
            <a 
              href="#home"
              style={{
                color: '#1a237e',
                fontWeight: '600',
                fontSize: '12px',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                border: '1px solid rgba(26, 35, 126, 0.2)',
                transition: 'all 0.3s ease',
                fontFamily: 'Cairo, sans-serif',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1a237e';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(26, 35, 126, 0.1)';
                e.target.style.color = '#1a237e';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              الرئيسية
            </a>
            
            <a 
              href="#features"
              style={{
                color: '#1a237e',
                fontWeight: '600',
                fontSize: '12px',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(26, 35, 126, 0.2)',
                transition: 'all 0.3s ease',
                fontFamily: 'Cairo, sans-serif',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1a237e';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#1a237e';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              المميزات
            </a>
            
            <a 
              href="#how"
              style={{
                color: '#1a237e',
                fontWeight: '600',
                fontSize: '12px',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(26, 35, 126, 0.2)',
                transition: 'all 0.3s ease',
                fontFamily: 'Cairo, sans-serif',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1a237e';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#1a237e';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              كيف تعمل
            </a>
            
            <a 
              href="#testimonials"
              style={{
                color: '#1a237e',
                fontWeight: '600',
                fontSize: '12px',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(26, 35, 126, 0.2)',
                transition: 'all 0.3s ease',
                fontFamily: 'Cairo, sans-serif',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1a237e';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#1a237e';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              آراء العملاء
            </a>
            
            <button 
              onClick={onGetStarted}
              style={{
                background: 'linear-gradient(135deg, #ff6f00, #ff8f00)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: '700',
                fontSize: '12px',
                boxShadow: '0 4px 15px rgba(255, 111, 0, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Cairo, sans-serif',
                whiteSpace: 'nowrap',
                marginLeft: '12px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 6px 20px rgba(255, 111, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(255, 111, 0, 0.3)';
              }}
            >
              ابدأ الآن
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="d-lg-none"
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#mobileNav"
            style={{
              backgroundColor: 'transparent',
              border: '2px solid #1a237e',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ width: '20px', height: '2px', backgroundColor: '#1a237e', borderRadius: '1px' }}></span>
              <span style={{ width: '20px', height: '2px', backgroundColor: '#1a237e', borderRadius: '1px' }}></span>
              <span style={{ width: '20px', height: '2px', backgroundColor: '#1a237e', borderRadius: '1px' }}></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          id="mobileNav"
          className="collapse d-lg-none"
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e0e0e0',
            marginTop: '12px',
            padding: '20px'
          }}
        >
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          >
            <a 
              href="#home"
              style={{
                color: '#1a237e',
                fontWeight: '600',
                fontSize: '12px',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                border: '1px solid rgba(26, 35, 126, 0.2)',
                fontFamily: 'Cairo, sans-serif',
                textAlign: 'center'
              }}
            >
              الرئيسية
            </a>
            
            <a 
              href="#features"
              style={{
                color: '#1a237e',
                fontWeight: '600',
                fontSize: '12px',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(26, 35, 126, 0.2)',
                fontFamily: 'Cairo, sans-serif',
                textAlign: 'center'
              }}
            >
              المميزات
            </a>
            
            <a 
              href="#how"
              style={{
                color: '#1a237e',
                fontWeight: '600',
                fontSize: '12px',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(26, 35, 126, 0.2)',
                fontFamily: 'Cairo, sans-serif',
                textAlign: 'center'
              }}
            >
              كيف تعمل
            </a>
            
            <a 
              href="#testimonials"
              style={{
                color: '#1a237e',
                fontWeight: '600',
                fontSize: '12px',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(26, 35, 126, 0.2)',
                fontFamily: 'Cairo, sans-serif',
                textAlign: 'center'
              }}
            >
              آراء العملاء
            </a>
            
            <button 
              onClick={onGetStarted}
              style={{
                background: 'linear-gradient(135deg, #ff6f00, #ff8f00)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: '700',
                fontSize: '12px',
                boxShadow: '0 4px 15px rgba(255, 111, 0, 0.3)',
                cursor: 'pointer',
                fontFamily: 'Cairo, sans-serif',
                marginTop: '8px'
              }}
            >
              ابدأ الآن
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="hero-content">
                <h1>
                  <span className="creative-3">
                    <span className="wave-text">منصة تجارتنا</span>
                  </span> الذكية
                </h1>
                <p className="lead">ثلاثة أطراف، منصة واحدة، تجارة سلسة بلا تعقيدات</p>
                <div className="hero-buttons">
                  <button className="btn-hero btn-primary-hero" onClick={onGetStarted}>
                    ابدأ مجاناً
                  </button>
                  <button className="btn-hero btn-outline-hero" onClick={onGoToMarketplace}>
                    اكتشف المزيد
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="hero-image">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="منصة تجارتنا" 
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">
              لماذا تختار <span className="creative-3"><span className="wave-text">منصتنا</span></span>؟
            </h2>
            <p className="lead">منصة مصممة لتجعل تجارتك سلسة وفعالة</p>
          </div>

          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-4" data-aos="fade-up" data-aos-delay={100 * (index + 1)}>
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className={feature.icon}></i>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="row">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 col-6" data-aos="zoom-in" data-aos-delay={100 * (index + 1)}>
                <div className="stat-item">
                  <div className="stat-number" data-count={stat.value}>0</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">
              كيف تعمل <span className="creative-3"><span className="wave-text">منصتنا</span></span>؟
            </h2>
            <p className="lead">ثلاث خطوات سلسة للبدء</p>
          </div>

          <div className="row g-4">
            {steps.map((step, index) => (
              <div key={index} className="col-md-4" data-aos="fade-up" data-aos-delay={100 * (index + 1)}>
                <div className="step-card">
                  <div className="step-number">{step.number}</div>
                  <div className="step-icon">
                    <i className={step.icon}></i>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">
              ماذا يقول عملاؤنا عن <span className="creative-3"><span className="wave-text">منصتنا</span></span>؟
            </h2>
            <p className="lead">تجارب حقيقية من شركات مثل شركتك</p>
          </div>

          <div className="row g-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-lg-4" data-aos="fade-up" data-aos-delay={100 * (index + 1)}>
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    {testimonial.content}
                  </div>
                  <div className="testimonial-author">
                    <img src={testimonial.avatar} alt="User" className="author-avatar" />
                    <div className="author-info">
                      <h4>{testimonial.author}</h4>
                      <p>{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" id="cta">
        <div className="container" data-aos="zoom-in">
          <h2>هل أنت مستعد لتجارة سلسة؟</h2>
          <p>
            انضم إلى آلاف الشركات التي تختار <span className="creative-3"><span className="wave-text">منصتنا</span></span> اليوم
          </p>
          <button className="btn-cta" onClick={onGetStarted}>
            جرب <span className="creative-3"><span className="wave-text">منصتنا</span></span> مجاناً
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="footer-widget">
                <h5>
                  <div className="creative-3">
                    <span className="wave-text">منصة تجارتنا</span>
                  </div>
                </h5>
                <p>منصة الربط التجاري الذكية التي تجمع بين ثلاثة أطراف في تجربة سلسة وفعالة.</p>
                <div className="social-icons">
                  <a href="#"><i className="bi bi-facebook"></i></a>
                  <a href="#"><i className="bi bi-twitter"></i></a>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                  <a href="#"><i className="bi bi-instagram"></i></a>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 mb-4">
              <div className="footer-widget">
                <h5>روابط سريعة</h5>
                <ul className="footer-links">
                  <li><a href="#home">الرئيسية</a></li>
                  <li><a href="#features">المميزات</a></li>
                  <li><a href="#how">كيف تعمل</a></li>
                  <li><a href="#testimonials">آراء العملاء</a></li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 mb-4">
              <div className="footer-widget">
                <h5>للمستخدمين</h5>
                <ul className="footer-links">
                  <li><a href="#" onClick={() => onGetStartedWithRole && onGetStartedWithRole('supplier')}>للموردين</a></li>
                  <li><a href="#" onClick={() => onGetStartedWithRole && onGetStartedWithRole('merchant')}>لتجار التجزئة</a></li>
                  <li><a href="#" onClick={() => onGetStartedWithRole && onGetStartedWithRole('shipping')}>لشركات الشحن</a></li>
                  <li><a href="#" onClick={onGetStarted}>التسجيل</a></li>
                </ul>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div className="footer-widget">
                <h5>تواصل معنا</h5>
                <ul className="footer-links">
                  <li><i className="bi bi-envelope me-2"></i> info@salasa.sa</li>
                  <li><i className="bi bi-telephone me-2"></i> +966 12 345 6789</li>
                  <li><i className="bi bi-geo-alt me-2"></i> الرياض، المملكة العربية السعودية</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="copyright">
            <p>&copy; 2023 <span className="creative-3"><span className="wave-text">منصة تجارتنا</span></span>. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;