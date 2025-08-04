document.addEventListener('DOMContentLoaded', function() {
    
    const langToggleBtn = document.getElementById('lang-toggle');
    const htmlEl = document.documentElement;
    let achievementsChartInstance;

    // --- Language Switcher ---
    function switchLanguage() {
        const isArabic = htmlEl.lang === 'ar';

        htmlEl.lang = isArabic ? 'en' : 'ar';
        htmlEl.dir = isArabic ? 'ltr' : 'rtl';
        document.body.classList.toggle('ltr', isArabic);
        langToggleBtn.textContent = isArabic ? 'AR' : 'EN';
        
        if (achievementsChartInstance) {
            achievementsChartInstance.destroy();
        }
        drawAchievementsChart();
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', switchLanguage);
    }

    // --- Achievements Chart (Doughnut) ---
    function drawAchievementsChart() {
        const ctx = document.getElementById('achievementsChart');
        if (!ctx) return;

        const isArabic = document.documentElement.lang === 'ar';
        const labels = isArabic 
            ? ['زيادة الإيرادات', 'خفض التكاليف', 'زيادة الطلب', 'كفاءة الفريق']
            : ['Revenue Growth', 'Cost Reduction', 'Order Increase', 'Team Efficiency'];
        
        achievementsChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: [40, 18, 35, 30],
                    backgroundColor: ['rgba(255, 215, 0, 0.8)','rgba(0, 255, 255, 0.8)','rgba(255, 99, 132, 0.8)','rgba(54, 162, 235, 0.8)'],
                    borderColor: '#1f1f1f',
                    borderWidth: 4,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '60%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#f0f0f0', padding: 20, font: { family: "'Tajawal', sans-serif", size: 14 } } },
                    tooltip: { enabled: true, callbacks: { label: function(context) { return ` ${context.label}: ${context.raw}%`; } } }
                }
            }
        });
    }

    // --- PDF Download Function ---
    function downloadCV() {
        const element = document.getElementById('cv-for-pdf');
        const isArabic = document.documentElement.lang === 'ar';
        const filename = isArabic ? 'محمود-مراد-سيرة-ذاتية.pdf' : 'Mahmoud-Mourad-CV.pdf';

        // إضافة CSS مؤقت لضمان بدء المحتوى من الأعلى
        const originalStyle = element.style.cssText;
        element.style.cssText += 'padding-top: 20px; margin-top: 0; transform: translateY(0);';

        const opt = {
            margin:       [0, 10, 10, 10], // هامش متساوي من جميع الجهات
            filename:     filename,
            image:        { type: 'jpeg', quality: 1.0 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true, 
                logging: false,
                scrollY: 0, // إعادة تعيين التمرير إلى الأعلى
                windowHeight: element.scrollHeight // التقاط الارتفاع الكامل
            },
            jsPDF:        { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                putOnlyUsedFonts: true,
                floatPrecision: 16
            }
        };

        html2pdf().from(element).set(opt).save().then(() => {
            // إعادة الأنماط الأصلية
            element.style.cssText = originalStyle;
        });
    }

    // --- CV Modal Logic ---
    const cvModal = document.getElementById('cv-modal');
    const openModalBtns = document.querySelectorAll('.open-cv-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const downloadFromModalBtn = document.getElementById('download-from-modal-btn');

    if(cvModal && openModalBtns.length > 0 && closeModalBtn && downloadFromModalBtn) {
        // Open modal when any "open" button is clicked
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                cvModal.style.display = 'flex';
            });
        });

        // Close modal with the close button
        closeModalBtn.addEventListener('click', () => {
            cvModal.style.display = 'none';
        });

        // Close modal by clicking on the overlay background
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                cvModal.style.display = 'none';
            }
        });

        // Trigger the actual PDF download from the button inside the modal
        downloadFromModalBtn.addEventListener('click', downloadCV);
    }


    // --- Gallery Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.getElementById('close-lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (lightbox && lightboxImg && closeLightboxBtn && galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = item.src;
            });
        });

        closeLightboxBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    // --- Initial Load ---
    document.body.classList.remove('ltr');
    drawAchievementsChart();
});
