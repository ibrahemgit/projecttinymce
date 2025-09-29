/**
 * ملف JavaScript لصفحة العرض العامة
 * يحتوي على وظائف عرض المحتوى والتفاعل مع المستخدم
 */

class PublicViewManager {
    constructor() {
        this.currentContent = null;
        this.isLoading = false;
        
        this.init();
    }

    /**
     * تهيئة صفحة العرض العامة
     */
    init() {
        this.setupEventListeners();
        this.loadContentFromURL();
        this.setupModals();
        this.setupPrintFunctionality();
        this.setupShareFunctionality();
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // زر العودة للمحرر
        document.getElementById('backToEditor').addEventListener('click', () => {
            this.goBackToEditor();
        });

        // زر الطباعة
        document.getElementById('printContent').addEventListener('click', () => {
            this.printContent();
        });

        // زر المشاركة
        document.getElementById('shareContent').addEventListener('click', () => {
            this.showShareModal();
        });

        // روابط الفوتر
        document.getElementById('aboutLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showAboutModal();
        });

        document.getElementById('helpLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showHelpModal();
        });

        document.getElementById('contactLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showContactModal();
        });

        // إغلاق النوافذ المنبثقة عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });

        // إغلاق النوافذ المنبثقة بمفتاح Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    /**
     * تحميل المحتوى من URL
     */
    loadContentFromURL() {
        this.showLoading(true);
        
        // محاولة الحصول على المحتوى من المعاملات
        const urlParams = new URLSearchParams(window.location.search);
        const contentParam = urlParams.get('content');
        const documentId = urlParams.get('id');
        
        if (contentParam) {
            // عرض المحتوى من المعامل
            this.displayContent(decodeURIComponent(contentParam));
        } else if (documentId) {
            // تحميل المحتوى من التخزين المحلي
            this.loadDocumentById(documentId);
        } else {
            // عرض محتوى افتراضي أو رسالة خطأ
            this.displayDefaultContent();
        }
    }

    /**
     * تحميل مستند بالمعرف
     */
    loadDocumentById(documentId) {
        try {
            const documents = JSON.parse(localStorage.getItem('tinyMCEDocuments') || '[]');
            const document = documents.find(doc => doc.id === documentId);
            
            if (document) {
                this.displayContent(document.content, document.title);
            } else {
                this.displayError('المستند غير موجود');
            }
        } catch (error) {
            console.error('خطأ في تحميل المستند:', error);
            this.displayError('حدث خطأ في تحميل المستند');
        }
    }

    /**
     * عرض المحتوى
     */
    displayContent(content, title = 'عرض المحتوى') {
        this.currentContent = content;
        
        // تحديث عنوان الصفحة
        document.title = title;
        
        // عرض المحتوى
        const contentDisplay = document.getElementById('contentDisplay');
        contentDisplay.innerHTML = content;
        
        // إضافة تأثيرات بصرية
        this.addVisualEffects();
        
        // إخفاء شاشة التحميل
        this.showLoading(false);
        
        // إضافة إحصائيات المحتوى
        this.addContentStats();
    }

    /**
     * عرض المحتوى الافتراضي
     */
    displayDefaultContent() {
        const defaultContent = `
            <div style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-file-alt" style="font-size: 4rem; color: #cbd5e0; margin-bottom: 20px;"></i>
                <h2 style="color: #4a5568; margin-bottom: 15px;">لا يوجد محتوى للعرض</h2>
                <p style="color: #718096; margin-bottom: 30px;">لم يتم العثور على محتوى للعرض. تأكد من صحة الرابط أو عد إلى المحرر.</p>
                <button onclick="window.location.href='../index.html'" class="btn btn-primary">
                    <i class="fas fa-edit"></i> العودة للمحرر
                </button>
            </div>
        `;
        
        this.displayContent(defaultContent, 'لا يوجد محتوى');
    }

    /**
     * عرض رسالة خطأ
     */
    displayError(message) {
        const errorContent = `
            <div style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #f56565; margin-bottom: 20px;"></i>
                <h2 style="color: #4a5568; margin-bottom: 15px;">حدث خطأ</h2>
                <p style="color: #718096; margin-bottom: 30px;">${message}</p>
                <button onclick="window.location.href='../index.html'" class="btn btn-primary">
                    <i class="fas fa-edit"></i> العودة للمحرر
                </button>
            </div>
        `;
        
        this.displayContent(errorContent, 'خطأ');
    }

    /**
     * إضافة تأثيرات بصرية
     */
    addVisualEffects() {
        const contentDisplay = document.getElementById('contentDisplay');
        
        // تأثير الظهور التدريجي للعناصر
        const elements = contentDisplay.querySelectorAll('h1, h2, h3, p, blockquote, .card, .alert, table, img');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // تأثير التمرير للصور
        const images = contentDisplay.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('click', () => {
                this.showImageModal(img.src, img.alt);
            });
            img.style.cursor = 'pointer';
        });

        // تأثير التمرير للجداول
        const tables = contentDisplay.querySelectorAll('table');
        tables.forEach(table => {
            if (table.scrollWidth > table.clientWidth) {
                table.style.overflowX = 'auto';
                table.style.borderRadius = '10px';
            }
        });
    }

    /**
     * إضافة إحصائيات المحتوى
     */
    addContentStats() {
        const contentDisplay = document.getElementById('contentDisplay');
        const text = contentDisplay.textContent || contentDisplay.innerText || '';
        
        const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        const characterCount = text.length;
        const readingTime = Math.ceil(wordCount / 200); // متوسط 200 كلمة في الدقيقة
        
        const statsHTML = `
            <div style="
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-radius: 10px;
                padding: 20px;
                margin: 30px 0;
                text-align: center;
                border: 1px solid #cbd5e0;
            ">
                <h4 style="margin: 0 0 15px 0; color: #4a5568;">إحصائيات المحتوى</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">
                    <div>
                        <div style="font-size: 2rem; font-weight: 700; color: #667eea;">${wordCount}</div>
                        <div style="font-size: 0.9rem; color: #718096;">كلمة</div>
                    </div>
                    <div>
                        <div style="font-size: 2rem; font-weight: 700; color: #48bb78;">${characterCount}</div>
                        <div style="font-size: 0.9rem; color: #718096;">حرف</div>
                    </div>
                    <div>
                        <div style="font-size: 2rem; font-weight: 700; color: #ed8936;">${readingTime}</div>
                        <div style="font-size: 0.9rem; color: #718096;">دقيقة قراءة</div>
                    </div>
                </div>
            </div>
        `;
        
        contentDisplay.insertAdjacentHTML('beforeend', statsHTML);
    }

    /**
     * العودة للمحرر
     */
    goBackToEditor() {
        window.location.href = '../index.html';
    }

    /**
     * طباعة المحتوى
     */
    printContent() {
        window.print();
    }

    /**
     * إعداد النوافذ المنبثقة
     */
    setupModals() {
        // إغلاق النوافذ المنبثقة
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });
    }

    /**
     * إظهار نافذة المشاركة
     */
    showShareModal() {
        const modal = document.getElementById('shareModal');
        const shareUrl = document.getElementById('shareUrl');
        
        // إنشاء رابط المشاركة
        const currentUrl = window.location.href;
        shareUrl.value = currentUrl;
        
        modal.classList.add('show');
    }

    /**
     * إظهار نافذة حول المشروع
     */
    showAboutModal() {
        const modal = document.getElementById('aboutModal');
        modal.classList.add('show');
    }

    /**
     * إظهار نافذة المساعدة
     */
    showHelpModal() {
        const helpContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>المساعدة</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <h4>كيفية استخدام صفحة العرض:</h4>
                    <ul>
                        <li>استخدم زر "العودة للمحرر" للعودة لصفحة التحرير</li>
                        <li>استخدم زر "طباعة" لطباعة المحتوى</li>
                        <li>استخدم زر "مشاركة" لمشاركة المحتوى مع الآخرين</li>
                        <li>انقر على الصور لعرضها بحجم أكبر</li>
                    </ul>
                    
                    <h4>اختصارات لوحة المفاتيح:</h4>
                    <ul>
                        <li><kbd>Ctrl + P</kbd> - طباعة</li>
                        <li><kbd>Escape</kbd> - إغلاق النوافذ المنبثقة</li>
                    </ul>
                </div>
            </div>
        `;
        
        this.showCustomModal(helpContent);
    }

    /**
     * إظهار نافذة الاتصال
     */
    showContactModal() {
        const contactContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>اتصل بنا</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center;">
                        <h4>محرر TinyMCE المخصص</h4>
                        <p>للاستفسارات والدعم التقني، يرجى التواصل معنا:</p>
                        
                        <div style="margin: 20px 0;">
                            <p><i class="fas fa-envelope"></i> البريد الإلكتروني: info@example.com</p>
                            <p><i class="fas fa-phone"></i> الهاتف: +966 50 123 4567</p>
                            <p><i class="fas fa-map-marker-alt"></i> العنوان: الرياض، المملكة العربية السعودية</p>
                        </div>
                        
                        <p style="color: #718096; font-size: 0.9rem;">
                            نسعد بخدمتكم ونرحب بملاحظاتكم واقتراحاتكم
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        this.showCustomModal(contactContent);
    }

    /**
     * إظهار نافذة مخصصة
     */
    showCustomModal(content) {
        // إزالة النوافذ المنبثقة الموجودة
        this.closeAllModals();
        
        // إنشاء نافذة منبثقة جديدة
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = content;
        
        document.body.appendChild(modal);
        
        // إضافة مستمع إغلاق
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        // إغلاق عند النقر خارج النافذة
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * إغلاق جميع النوافذ المنبثقة
     */
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    /**
     * إعداد وظائف المشاركة
     */
    setupShareFunctionality() {
        // نسخ الرابط
        document.getElementById('copyUrl').addEventListener('click', () => {
            const shareUrl = document.getElementById('shareUrl');
            shareUrl.select();
            document.execCommand('copy');
            this.showNotification('تم نسخ الرابط بنجاح', 'success');
        });

        // أزرار المشاركة
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const method = btn.dataset.method;
                this.handleShare(method);
            });
        });
    }

    /**
     * معالجة المشاركة
     */
    handleShare(method) {
        const url = window.location.href;
        const title = document.title;
        
        switch (method) {
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    this.showNotification('تم نسخ الرابط بنجاح', 'success');
                });
                break;
                
            case 'email':
                const emailSubject = encodeURIComponent(`مشاركة: ${title}`);
                const emailBody = encodeURIComponent(`تحقق من هذا المحتوى: ${url}`);
                window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
                break;
                
            case 'social':
                this.showSocialShareOptions(url, title);
                break;
        }
    }

    /**
     * إظهار خيارات المشاركة الاجتماعية
     */
    showSocialShareOptions(url, title) {
        const socialContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>مشاركة على وسائل التواصل</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">
                        <button class="social-share-btn" data-platform="twitter">
                            <i class="fab fa-twitter"></i>
                            تويتر
                        </button>
                        <button class="social-share-btn" data-platform="facebook">
                            <i class="fab fa-facebook"></i>
                            فيسبوك
                        </button>
                        <button class="social-share-btn" data-platform="linkedin">
                            <i class="fab fa-linkedin"></i>
                            لينكد إن
                        </button>
                        <button class="social-share-btn" data-platform="whatsapp">
                            <i class="fab fa-whatsapp"></i>
                            واتساب
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.showCustomModal(socialContent);
        
        // إضافة مستمعي الأحداث لأزرار المشاركة الاجتماعية
        document.querySelectorAll('.social-share-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.dataset.platform;
                this.shareToSocial(platform, url, title);
            });
        });
    }

    /**
     * المشاركة على وسائل التواصل الاجتماعي
     */
    shareToSocial(platform, url, title) {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);
        
        let shareUrl = '';
        
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    /**
     * إعداد وظائف الطباعة
     */
    setupPrintFunctionality() {
        // اختصار لوحة المفاتيح للطباعة
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                this.printContent();
            }
        });
    }

    /**
     * إظهار/إخفاء شاشة التحميل
     */
    showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (show) {
            loadingOverlay.classList.add('show');
            this.isLoading = true;
        } else {
            loadingOverlay.classList.remove('show');
            this.isLoading = false;
        }
    }

    /**
     * إظهار نافذة الصورة
     */
    showImageModal(imageSrc, imageAlt) {
        const imageModal = `
            <div class="modal show" id="imageModal">
                <div class="modal-content" style="max-width: 90vw; max-height: 90vh; padding: 0;">
                    <div class="modal-header" style="padding: 15px 20px;">
                        <h3>${imageAlt || 'صورة'}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div style="text-align: center; padding: 20px;">
                        <img src="${imageSrc}" alt="${imageAlt}" style="max-width: 100%; max-height: 70vh; border-radius: 10px;">
                    </div>
                </div>
            </div>
        `;
        
        this.showCustomModal(imageModal);
    }

    /**
     * عرض إشعار
     */
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            border-left: 4px solid ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#ed8936'};
            z-index: 10001;
            animation: slideIn 0.3s ease;
        `;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 
                    type === 'error' ? 'fas fa-exclamation-circle' : 
                    'fas fa-exclamation-triangle';
        
        notification.innerHTML = `
            <i class="${icon}" style="margin-left: 10px; color: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#ed8936'};"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد 3 ثوان
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// تهيئة صفحة العرض العامة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.publicViewManager = new PublicViewManager();
});
