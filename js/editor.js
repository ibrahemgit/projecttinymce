/**
 * ملف إعدادات محرر TinyMCE المتقدم
 * يحتوي على تخصيصات إضافية للمحرر
 */

class EditorCustomizer {
    constructor(editorInstance) {
        this.editor = editorInstance;
        this.setupCustomButtons();
        this.setupDragAndDrop();
        this.setupKeyboardShortcuts();
    }

    /**
     * إعداد أزرار مخصصة للمحرر
     */
    setupCustomButtons() {
        if (!this.editor) return;

        // زر إدراج جدول متقدم
        this.editor.ui.registry.addButton('customtable', {
            text: 'جدول متقدم',
            icon: 'table',
            onAction: () => this.insertAdvancedTable()
        });

        // زر إدراج كود
        this.editor.ui.registry.addButton('customcode', {
            text: 'كود',
            icon: 'code',
            onAction: () => this.insertCodeBlock()
        });

        // زر إدراج رابط متقدم
        this.editor.ui.registry.addButton('customlink', {
            text: 'رابط متقدم',
            icon: 'link',
            onAction: () => this.insertAdvancedLink()
        });

        // زر إدراج صورة محسنة
        this.editor.ui.registry.addButton('customimage', {
            text: 'صورة محسنة',
            icon: 'image',
            onAction: () => this.insertEnhancedImage()
        });

        // زر إدراج فيديو
        this.editor.ui.registry.addButton('customvideo', {
            text: 'فيديو',
            icon: 'embed',
            onAction: () => this.insertVideo()
        });

        // زر إدراج قائمة مهام
        this.editor.ui.registry.addButton('customtodo', {
            text: 'قائمة مهام',
            icon: 'checklist',
            onAction: () => this.insertTodoList()
        });
    }

    /**
     * إدراج جدول متقدم
     */
    insertAdvancedTable() {
        const tableHTML = `
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; direction: rtl;">
                <thead>
                    <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                        <th style="padding: 15px; border: 1px solid #ddd; text-align: right;">العنوان الأول</th>
                        <th style="padding: 15px; border: 1px solid #ddd; text-align: right;">العنوان الثاني</th>
                        <th style="padding: 15px; border: 1px solid #ddd; text-align: right;">العنوان الثالث</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 15px; border: 1px solid #ddd; text-align: right;">المحتوى الأول</td>
                        <td style="padding: 15px; border: 1px solid #ddd; text-align: right;">المحتوى الثاني</td>
                        <td style="padding: 15px; border: 1px solid #ddd; text-align: right;">المحتوى الثالث</td>
                    </tr>
                    <tr style="background: #f8fafc;">
                        <td style="padding: 15px; border: 1px solid #ddd; text-align: right;">صف ثاني</td>
                        <td style="padding: 15px; border: 1px solid #ddd; text-align: right;">صف ثاني</td>
                        <td style="padding: 15px; border: 1px solid #ddd; text-align: right;">صف ثاني</td>
                    </tr>
                </tbody>
            </table>
        `;
        
        this.editor.insertContent(tableHTML);
        this.showNotification('تم إدراج جدول متقدم', 'success');
    }

    /**
     * إدراج كتلة كود
     */
    insertCodeBlock() {
        const codeHTML = `
            <pre style="background: #2d3748; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto; direction: ltr; text-align: left;">
<code>// مثال على الكود
function hello() {
    console.log("مرحباً بالعالم!");
}

hello();</code>
            </pre>
        `;
        
        this.editor.insertContent(codeHTML);
        this.showNotification('تم إدراج كتلة كود', 'success');
    }

    /**
     * إدراج رابط متقدم
     */
    insertAdvancedLink() {
        const url = prompt('أدخل رابط الموقع:');
        const text = prompt('أدخل نص الرابط:');
        const target = confirm('هل تريد فتح الرابط في نافذة جديدة؟') ? '_blank' : '_self';
        
        if (url && text) {
            const linkHTML = `
                <a href="${url}" target="${target}" style="color: #667eea; text-decoration: none; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 2px;">
                    ${text}
                </a>
            `;
            
            this.editor.insertContent(linkHTML);
            this.showNotification('تم إدراج رابط متقدم', 'success');
        }
    }

    /**
     * إدراج صورة محسنة
     */
    insertEnhancedImage() {
        const imageUrl = prompt('أدخل رابط الصورة:');
        const altText = prompt('أدخل النص البديل للصورة:');
        const caption = prompt('أدخل تعليق الصورة (اختياري):');
        
        if (imageUrl) {
            let imageHTML = `
                <div style="text-align: center; margin: 20px 0;">
                    <img src="${imageUrl}" alt="${altText || ''}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            `;
            
            if (caption) {
                imageHTML += `
                    <p style="font-style: italic; color: #666; margin-top: 10px; font-size: 14px;">
                        ${caption}
                    </p>
                `;
            }
            
            imageHTML += '</div>';
            
            this.editor.insertContent(imageHTML);
            this.showNotification('تم إدراج صورة محسنة', 'success');
        }
    }

    /**
     * إدراج فيديو
     */
    insertVideo() {
        const videoUrl = prompt('أدخل رابط الفيديو (YouTube, Vimeo, إلخ):');
        
        if (videoUrl) {
            let videoHTML = '';
            
            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                const videoId = this.extractYouTubeId(videoUrl);
                videoHTML = `
                    <div style="text-align: center; margin: 20px 0;">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" 
                                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen style="border-radius: 8px; max-width: 100%;">
                        </iframe>
                    </div>
                `;
            } else {
                videoHTML = `
                    <div style="text-align: center; margin: 20px 0;">
                        <video controls style="max-width: 100%; border-radius: 8px;">
                            <source src="${videoUrl}" type="video/mp4">
                            متصفحك لا يدعم تشغيل الفيديو.
                        </video>
                    </div>
                `;
            }
            
            this.editor.insertContent(videoHTML);
            this.showNotification('تم إدراج فيديو', 'success');
        }
    }

    /**
     * إدراج قائمة مهام
     */
    insertTodoList() {
        const todoHTML = `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h4 style="margin: 0 0 15px 0; color: #4a5568;">قائمة المهام</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center;">
                        <input type="checkbox" style="margin-left: 10px;"> مهمة أولى
                    </li>
                    <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center;">
                        <input type="checkbox" style="margin-left: 10px;"> مهمة ثانية
                    </li>
                    <li style="padding: 8px 0; display: flex; align-items: center;">
                        <input type="checkbox" style="margin-left: 10px;"> مهمة ثالثة
                    </li>
                </ul>
            </div>
        `;
        
        this.editor.insertContent(todoHTML);
        this.showNotification('تم إدراج قائمة مهام', 'success');
    }

    /**
     * استخراج معرف فيديو YouTube
     */
    extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    /**
     * إعداد السحب والإفلات
     */
    setupDragAndDrop() {
        if (!this.editor) return;

        const editorContainer = this.editor.getContainer();
        
        // التحقق من وجود العنصر قبل إضافة المستمعين
        if (!editorContainer) return;
        
        // منع السلوك الافتراضي للسحب والإفلات
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            editorContainer.addEventListener(eventName, this.preventDefaults, false);
        });

        // إضافة تأثيرات بصرية عند السحب
        ['dragenter', 'dragover'].forEach(eventName => {
            editorContainer.addEventListener(eventName, () => {
                editorContainer.style.border = '2px dashed #667eea';
                editorContainer.style.backgroundColor = '#f8fafc';
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            editorContainer.addEventListener(eventName, () => {
                editorContainer.style.border = '';
                editorContainer.style.backgroundColor = '';
            }, false);
        });

        // معالجة إفلات الملفات
        editorContainer.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            
            for (let file of files) {
                if (file.type.startsWith('image/')) {
                    this.handleImageDrop(file);
                } else if (file.type.startsWith('text/')) {
                    this.handleTextDrop(file);
                }
            }
        }, false);
    }

    /**
     * معالجة إفلات الصور
     */
    handleImageDrop(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageHTML = `
                <div style="text-align: center; margin: 20px 0;">
                    <img src="${e.target.result}" alt="${file.name}" 
                         style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                </div>
            `;
            this.editor.insertContent(imageHTML);
            this.showNotification('تم إدراج الصورة بنجاح', 'success');
        };
        reader.readAsDataURL(file);
    }

    /**
     * معالجة إفلات النصوص
     */
    handleTextDrop(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.editor.insertContent(`<p>${e.target.result}</p>`);
            this.showNotification('تم إدراج النص بنجاح', 'success');
        };
        reader.readAsText(file);
    }

    /**
     * إعداد اختصارات لوحة المفاتيح
     */
    setupKeyboardShortcuts() {
        if (!this.editor) return;

        // Ctrl+S للحفظ
        this.editor.shortcuts.add('ctrl+s', 'حفظ المستند', () => {
            if (window.tinyMCEEditor) {
                window.tinyMCEEditor.saveContent();
            }
        });

        // Ctrl+Shift+P للمعاينة
        this.editor.shortcuts.add('ctrl+shift+p', 'معاينة المستند', () => {
            if (window.tinyMCEEditor) {
                window.tinyMCEEditor.previewContent();
            }
        });

        // Ctrl+Z للتراجع
        this.editor.shortcuts.add('ctrl+z', 'تراجع', () => {
            this.editor.undoManager.undo();
        });

        // Ctrl+Y للإعادة
        this.editor.shortcuts.add('ctrl+y', 'إعادة', () => {
            this.editor.undoManager.redo();
        });
    }

    /**
     * منع السلوك الافتراضي للأحداث
     */
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * عرض إشعار
     */
    showNotification(message, type = 'success') {
        if (window.tinyMCEEditor) {
            window.tinyMCEEditor.showNotification(message, type);
        }
    }
}

// تصدير الكلاس للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EditorCustomizer;
}
