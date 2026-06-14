let lastScrollTop = 0;
const header = document.querySelector('header');
const heroSection = document.querySelector('.hero'); 

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    let heroHeight = heroSection ? heroSection.offsetHeight - 80 : 600;

    if (scrollTop > heroHeight) {
        header.classList.add('header--light-bg');
    } else {
        header.classList.remove('header--light-bg');
    }

    if (scrollTop > lastScrollTop && scrollTop > 150) {
        header.classList.add('header--hidden');
    } else {
        header.classList.remove('header--hidden');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".gallery__track");
    const prevBtn = document.querySelector(".gallery__arrow--prev");
    const nextBtn = document.querySelector(".gallery__arrow--next");

    if (!track || !prevBtn || !nextBtn) return;

    const originalSlides = Array.from(track.children);
    const visibleItems = 3;
    const gap = 20;

    for (let i = originalSlides.length - visibleItems; i < originalSlides.length; i++) {
        const clone = originalSlides[i].cloneNode(true);
        track.insertBefore(clone, track.firstChild);
    }

    for (let i = 0; i < visibleItems; i++) {
        const clone = originalSlides[i].cloneNode(true);
        track.appendChild(clone);
    }

    const getSizes = () => {
        const singleSlide = track.querySelector(".gallery__slide");
        const slideWidth = singleSlide ? singleSlide.getBoundingClientRect().width + gap : 300;
        const totalOriginalWidth = originalSlides.length * slideWidth;
        return { slideWidth, totalOriginalWidth };
    };

    const { slideWidth: initWidth } = getSizes();
    track.scrollLeft = visibleItems * initWidth;

    const checkBounds = () => {
        const { slideWidth, totalOriginalWidth } = getSizes();
        const currentScroll = track.scrollLeft;

        const leftTrigger = (visibleItems - 1) * slideWidth; 
        const rightTrigger = (visibleItems + originalSlides.length) * slideWidth;

        if (currentScroll <= leftTrigger + 15) {
            track.style.scrollBehavior = "auto";
            track.scrollLeft += totalOriginalWidth;
        }

        else if (currentScroll >= rightTrigger - 15) {
            track.style.scrollBehavior = "auto";
            track.scrollLeft -= totalOriginalWidth;
        }
    };

    nextBtn.addEventListener("click", () => {
        const { slideWidth } = getSizes();
        track.style.scrollBehavior = "smooth";
        track.scrollLeft += slideWidth;
    });

    prevBtn.addEventListener("click", () => {
        const { slideWidth } = getSizes();
        track.style.scrollBehavior = "smooth";
        track.scrollLeft -= slideWidth;
    });

    track.addEventListener("scrollend", checkBounds);
});

const burger = document.querySelector('.burger');
const nav = document.querySelector('.header__nav');

burger.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    nav.classList.toggle('is-open');
    document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
});

document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('is-open');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
    });
});

const fadeElements = document.querySelectorAll(
    '.feature-item, .service-btn, .gallery__card, .review-item, .about__content, .section-title, .block-header, .promo-banner__content, .order__form-side'
);

fadeElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.7s ease ${i % 4 * 0.1}s, transform 0.7s ease ${i % 4 * 0.1}s`;
});

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

fadeElements.forEach(el => fadeObserver.observe(el));


const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        hero.style.backgroundPositionY = `calc(50% + ${scrolled * 0.3}px)`;
    }, { passive: true });
}

const heroTitle = document.querySelector('.hero__title');
if (heroTitle) {
    const words = heroTitle.textContent.trim().split(' ');
    heroTitle.innerHTML = words.map((word, i) =>
        `<span style="
            display: inline-block;
            opacity: 0;
            transform: translateY(24px);
            transition: opacity 0.6s ease ${0.1 + i * 0.12}s, transform 0.6s ease ${0.1 + i * 0.12}s;
        ">${word}&nbsp;</span>`
    ).join('');

    requestAnimationFrame(() => {
        heroTitle.querySelectorAll('span').forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        });
    });
}

const aboutLink = document.querySelector('.about__link');
if (aboutLink) {
    const arrow = aboutLink.querySelector('.about__arrow');
    if (arrow) {
        arrow.style.transition = 'transform 0.3s ease';
        aboutLink.addEventListener('mouseenter', () => {
            arrow.style.transform = 'translateX(6px)';
        });
        aboutLink.addEventListener('mouseleave', () => {
            arrow.style.transform = 'translateX(0)';
        });
    }
}

const featureNums = document.querySelectorAll('.feature-item__num');

const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.textContent);
            let current = 0;
            const step = Math.ceil(target / 20);
            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                el.textContent = String(current).padStart(2, '0');
            }, 40);
            countObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

featureNums.forEach(el => countObserver.observe(el));

const quoteText = document.querySelector('.quote-accent__text');
if (quoteText) {
    const html = quoteText.innerHTML;
    const words = html.replace(/<br>/g, ' <br> ').split(' ');

    quoteText.innerHTML = words.map((word, i) => {
        if (word === '<br>') return '<br>';
        return `<span style="
            display: inline-block;
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s;
        ">${word}&nbsp;</span>`;
    }).join('');

    const quoteObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('span').forEach(span => {
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0)';
                });
                quoteObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    quoteObserver.observe(quoteText);
}

document.querySelectorAll('.service-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-5px)';
        btn.style.transition = 'transform 0.3s ease';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
    });
});