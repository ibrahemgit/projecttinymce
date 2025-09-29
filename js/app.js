/**
 * التطبيق الرئيسي - TinyMCE Custom Editor
 * يحتوي على الوظائف الأساسية للتطبيق
 */

class TinyMCEEditor {
    constructor() {
        this.editor = null;
        this.isInitialized = false;
        this.autoSaveInterval = null;
        this.wordCount = 0;
        
        this.init();
    }

    /**
     * تهيئة التطبيق
     */
    init() {
        this.setupEventListeners();
        this.initializeEditor();
        this.setupAutoSave();
        this.loadSavedContent();
        this.loadSettings();
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // أزرار الحفظ والمعاينة والتحميل
        document.getElementById('saveBtn').addEventListener('click', () => this.saveContent());
        document.getElementById('previewBtn').addEventListener('click', () => this.previewContent());
        document.getElementById('loadBtn').addEventListener('click', () => this.loadContent());

        // تغيير حجم الخط
        document.getElementById('fontSize').addEventListener('change', (e) => {
            this.changeFontSize(e.target.value);
        });

        // إعداد مكونات جاهزة
        this.setupComponentButtons();
    }

    /**
     * تهيئة محرر TinyMCE
     */
    initializeEditor() {
        try {
            tinymce.init({
            selector: '#editor',
            language: 'ar',
            directionality: 'rtl',
            height: 500,
            menubar: false,
            branding: false,
            promotion: false,
            readonly: false,
            resize: true,
            elementpath: true,
            statusbar: true,
            menubar: false,
            contextmenu: 'link image table',
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
                'textpattern', 'nonbreaking', 'pagebreak', 'save', 'directionality', 'paste',
                'colorpicker', 'textcolor', 'template', 'codesample', 'hr', 'pagebreak',
                'quickbars', 'accordion', 'advcode', 'checklist', 'export'
            ],
            toolbar: 'undo redo | blocks | ' +
                'bold italic underline strikethrough | alignleft aligncenter ' +
                'alignright alignjustify | outdent indent |  numlist bullist | ' +
                'forecolor backcolor removeformat | pagebreak | charmap emoticons | ' +
                'codesample hr checklist | fullscreen preview save | help',
            content_style: `
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    font-size: 14px; 
                    line-height: 1.6;
                    direction: rtl;
                    text-align: right;
                }
                h1, h2, h3, h4, h5, h6 { 
                    color: #4a5568; 
                    margin: 20px 0 10px 0;
                }
                p { 
                    margin: 10px 0; 
                }
                blockquote {
                    border-right: 4px solid #667eea;
                    padding: 15px 20px;
                    margin: 20px 0;
                    background: #f8fafc;
                    border-radius: 0 8px 8px 0;
                }
                .alert {
                    padding: 15px 20px;
                    margin: 15px 0;
                    border-radius: 8px;
                    border-right: 4px solid;
                }
                .alert-success {
                    background: #f0fff4;
                    border-color: #48bb78;
                    color: #22543d;
                }
                .alert-warning {
                    background: #fffaf0;
                    border-color: #ed8936;
                    color: #c05621;
                }
                .alert-error {
                    background: #fff5f5;
                    border-color: #f56565;
                    color: #c53030;
                }
                .card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 15px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .divider {
                    border: none;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #667eea, transparent);
                    margin: 30px 0;
                }
            `,
            setup: (editor) => {
                this.editor = editor;
                this.isInitialized = true;
                
                // تحديث عداد الكلمات
                editor.on('keyup', () => this.updateWordCount());
                editor.on('change', () => this.updateWordCount());
                
                // حفظ تلقائي عند التغيير
                editor.on('change', () => this.autoSave());
                
                // تهيئة مدير التخصيصات مع معالجة الأخطاء
                try {
                    if (typeof EditorCustomizer !== 'undefined') {
                        new EditorCustomizer(editor);
                    }
                } catch (error) {
                    console.warn('خطأ في تهيئة مدير التخصيصات:', error);
                }
                
                console.log('تم تهيئة محرر TinyMCE بنجاح');
            },
            init_instance_callback: (editor) => {
                this.updateWordCount();
                console.log('تم تحميل محرر TinyMCE');
            }
        });
        } catch (error) {
            console.error('خطأ في تهيئة محرر TinyMCE:', error);
            this.showNotification('خطأ في تحميل المحرر', 'error');
        }
    }

    /**
     * إعداد أزرار المكونات الجاهزة
     */
    setupComponentButtons() {
        const componentButtons = document.querySelectorAll('.component-btn');
        componentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const component = button.dataset.component;
                this.insertComponent(component);
            });
        });
        
        // إضافة تأثيرات بصرية للأزرار
        componentButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            });
        });
    }

    /**
     * إدراج مكون جاهز
     */
    insertComponent(componentType) {
        if (!this.editor) return;

        let componentHTML = '';
        
        // استخدام مدير المكونات إذا كان متاحاً
        if (window.componentManager) {
            componentHTML = window.componentManager.getComponent(componentType);
        } else {
            // استخدام المكونات الأساسية
            switch (componentType) {
                case 'alert':
                    componentHTML = `
                        <div class="alert alert-success">
                            <strong>تنبيه:</strong> هذا نص تنبيه مهم للمستخدم.
                        </div>
                    `;
                    break;
                case 'quote':
                    componentHTML = `
                        <blockquote>
                            <p>هذا اقتباس مهم من نص أو شخصية معروفة.</p>
                            <cite>— المؤلف</cite>
                        </blockquote>
                    `;
                    break;
                case 'card':
                    componentHTML = `
                        <div class="card">
                            <h3>عنوان البطاقة</h3>
                            <p>محتوى البطاقة يكتب هنا...</p>
                        </div>
                    `;
                    break;
                case 'divider':
                    componentHTML = '<hr class="divider">';
                    break;
            }
        }

        this.editor.insertContent(componentHTML);
        this.showNotification('تم إدراج المكون بنجاح', 'success');
    }

    /**
     * تغيير حجم الخط
     */
    changeFontSize(size) {
        if (!this.editor) return;
        
        this.editor.getBody().style.fontSize = size;
        this.showNotification(`تم تغيير حجم الخط إلى ${size}`, 'success');
        
        // حفظ الإعداد في التخزين المحلي
        if (window.storageManager) {
            window.storageManager.saveSettings({ fontSize: size });
        } else {
            localStorage.setItem('editorFontSize', size);
        }
    }

    /**
     * تحديث عداد الكلمات
     */
    updateWordCount() {
        if (!this.editor) return;
        
        const content = this.editor.getContent({ format: 'text' });
        const words = content.trim().split(/\s+/).filter(word => word.length > 0);
        this.wordCount = words.length;
        
        const wordCountElement = document.getElementById('wordCount');
        if (wordCountElement) {
            wordCountElement.textContent = this.wordCount;
            
            // إضافة تأثير بصري عند التحديث
            wordCountElement.style.transform = 'scale(1.1)';
            wordCountElement.style.color = '#667eea';
            
            setTimeout(() => {
                wordCountElement.style.transform = 'scale(1)';
                wordCountElement.style.color = '';
            }, 200);
        }
    }

    /**
     * حفظ المحتوى
     */
    saveContent() {
        if (!this.editor) return;
        
        const content = this.editor.getContent();
        const title = prompt('أدخل عنوان للمستند:', 'مستند جديد');
        
        if (title) {
            const documentData = {
                title: title,
                content: content,
                wordCount: this.wordCount,
                characterCount: content.length,
                tags: [],
                category: 'عام'
            };
            
            // استخدام مدير التخزين إذا كان متاحاً
            if (window.storageManager) {
                const documentId = window.storageManager.saveDocument(documentData);
                if (documentId) {
                    this.showNotification('تم حفظ المستند بنجاح', 'success');
                }
            } else {
                // استخدام التخزين الأساسي
                const savedDocuments = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
                savedDocuments.push({
                    ...documentData,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('savedDocuments', JSON.stringify(savedDocuments));
                this.showNotification('تم حفظ المستند بنجاح', 'success');
            }
        }
    }

    /**
     * معاينة المحتوى
     */
    previewContent() {
        if (!this.editor) return;
        
        const content = this.editor.getContent();
        
        // إنشاء URL للمعاينة
        const previewUrl = `public/index.html?content=${encodeURIComponent(content)}`;
        
        // فتح صفحة المعاينة
        window.open(previewUrl, '_blank', 'width=1200,height=800');
    }

    /**
     * تحميل المحتوى
     */
    loadContent() {
        // استخدام مدير التخزين إذا كان متاحاً
        if (window.storageManager) {
            const documents = window.storageManager.getAllDocuments();
            
            if (documents.length === 0) {
                this.showNotification('لا توجد مستندات محفوظة', 'warning');
                return;
            }
            
            const titles = documents.map((doc, index) => `${index + 1}. ${doc.title}`);
            const selection = prompt(`اختر المستند للتحميل:\n${titles.join('\n')}\n\nأدخل رقم المستند:`);
            
            const index = parseInt(selection) - 1;
            if (index >= 0 && index < documents.length) {
                const document = documents[index];
                this.editor.setContent(document.content);
                this.showNotification(`تم تحميل: ${document.title}`, 'success');
            }
        } else {
            // استخدام التخزين الأساسي
            const savedDocuments = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
            
            if (savedDocuments.length === 0) {
                this.showNotification('لا توجد مستندات محفوظة', 'warning');
                return;
            }
            
            const titles = savedDocuments.map((doc, index) => `${index + 1}. ${doc.title}`);
            const selection = prompt(`اختر المستند للتحميل:\n${titles.join('\n')}\n\nأدخل رقم المستند:`);
            
            const index = parseInt(selection) - 1;
            if (index >= 0 && index < savedDocuments.length) {
                const document = savedDocuments[index];
                this.editor.setContent(document.content);
                this.showNotification(`تم تحميل: ${document.title}`, 'success');
            }
        }
    }

    /**
     * تحميل المحتوى المحفوظ تلقائياً
     */
    loadSavedContent() {
        // استخدام مدير التخزين إذا كان متاحاً
        if (window.storageManager) {
            const lastAutoSave = window.storageManager.getLastAutoSave();
            if (lastAutoSave && this.editor) {
                setTimeout(() => {
                    this.editor.setContent(lastAutoSave.content);
                    this.showNotification('تم استرجاع المحتوى المحفوظ تلقائياً', 'success');
                }, 1000);
            }
        } else {
            // استخدام التخزين الأساسي
            const autoSavedContent = localStorage.getItem('autoSavedContent');
            if (autoSavedContent && this.editor) {
                setTimeout(() => {
                    this.editor.setContent(autoSavedContent);
                    this.showNotification('تم استرجاع المحتوى المحفوظ تلقائياً', 'success');
                }, 1000);
            }
        }
    }

    /**
     * حفظ تلقائي
     */
    autoSave() {
        if (!this.editor) return;
        
        const content = this.editor.getContent();
        
        // استخدام مدير التخزين إذا كان متاحاً
        if (window.storageManager) {
            window.storageManager.autoSave(content);
        } else {
            // استخدام التخزين الأساسي
            localStorage.setItem('autoSavedContent', content);
            localStorage.setItem('lastAutoSave', new Date().toISOString());
        }
    }

    /**
     * إعداد الحفظ التلقائي
     */
    setupAutoSave() {
        // استخدام إعدادات مدير التخزين إذا كان متاحاً
        const interval = window.storageManager ? 
            window.storageManager.autoSaveInterval : 30000;
        
        // حفظ تلقائي
        this.autoSaveInterval = setInterval(() => {
            this.autoSave();
        }, interval);
    }

    /**
     * عرض إشعار
     */
    showNotification(message, type = 'success') {
        const notificationsContainer = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 
                    type === 'error' ? 'fas fa-exclamation-circle' : 
                    'fas fa-exclamation-triangle';
        
        notification.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        notificationsContainer.appendChild(notification);
        
        // إضافة تأثير الظهور
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // إزالة الإشعار بعد 3 ثوان
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * تحميل الإعدادات المحفوظة
     */
    loadSettings() {
        if (window.storageManager) {
            const settings = window.storageManager.loadSettings();
            
            // تطبيق حجم الخط المحفوظ
            if (settings.fontSize) {
                const fontSizeSelect = document.getElementById('fontSize');
                if (fontSizeSelect) {
                    fontSizeSelect.value = settings.fontSize;
                }
            }
        } else {
            // استخدام التخزين الأساسي
            const savedFontSize = localStorage.getItem('editorFontSize');
            if (savedFontSize) {
                const fontSizeSelect = document.getElementById('fontSize');
                if (fontSizeSelect) {
                    fontSizeSelect.value = savedFontSize;
                }
            }
        }
    }

    /**
     * تنظيف الموارد
     */
    destroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        if (this.editor) {
            this.editor.destroy();
        }
    }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تهيئة مدير التخزين أولاً
    if (typeof storageManager !== 'undefined') {
        window.storageManager = storageManager;
    }
    
    // تهيئة مدير المكونات
    if (typeof componentManager !== 'undefined') {
        window.componentManager = componentManager;
    }
    
    // تهيئة التطبيق الرئيسي
    window.tinyMCEEditor = new TinyMCEEditor();
    
    // إضافة مستمعي الأحداث الإضافية
    setupAdditionalEventListeners();
});

/**
 * إعداد مستمعي الأحداث الإضافية
 */
function setupAdditionalEventListeners() {
    // مستمع تغيير التخزين
    window.addEventListener('storage', (e) => {
        if (e.key === 'tinyMCEDocuments') {
            console.log('تم تحديث المستندات في التخزين');
        }
    });
    
    // مستمع تغيير الحجم
    window.addEventListener('resize', () => {
        if (window.tinyMCEEditor && window.tinyMCEEditor.editor) {
            window.tinyMCEEditor.editor.layout();
        }
    });
    
    // مستمع التركيز/فقدان التركيز
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // حفظ تلقائي عند فقدان التركيز
            if (window.tinyMCEEditor) {
                window.tinyMCEEditor.autoSave();
            }
        }
    });
}

// تنظيف الموارد عند إغلاق الصفحة
window.addEventListener('beforeunload', () => {
    if (window.tinyMCEEditor) {
        // حفظ تلقائي نهائي
        window.tinyMCEEditor.autoSave();
        
        // تنظيف الموارد
        window.tinyMCEEditor.destroy();
    }
});

// مستمع تغيير الصفحة
window.addEventListener('pagehide', () => {
    if (window.tinyMCEEditor) {
        window.tinyMCEEditor.autoSave();
    }
});
