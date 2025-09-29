/**
 * ملف المكونات الجاهزة والمخصصة
 * يحتوي على قوالب جاهزة يمكن إدراجها في المحرر
 */

class ComponentManager {
    constructor() {
        this.components = new Map();
        this.initializeComponents();
    }

    /**
     * تهيئة المكونات المتاحة
     */
    initializeComponents() {
        this.registerComponent('alert', this.createAlertComponent);
        this.registerComponent('quote', this.createQuoteComponent);
        this.registerComponent('card', this.createCardComponent);
        this.registerComponent('divider', this.createDividerComponent);
        this.registerComponent('timeline', this.createTimelineComponent);
        this.registerComponent('pricing', this.createPricingComponent);
        this.registerComponent('testimonial', this.createTestimonialComponent);
        this.registerComponent('faq', this.createFAQComponent);
        this.registerComponent('contact', this.createContactComponent);
        this.registerComponent('gallery', this.createGalleryComponent);
    }

    /**
     * تسجيل مكون جديد
     */
    registerComponent(name, creatorFunction) {
        this.components.set(name, creatorFunction);
    }

    /**
     * إنشاء مكون التنبيه
     */
    createAlertComponent(type = 'success', title = 'تنبيه', message = 'هذا نص تنبيه مهم للمستخدم.') {
        const alertTypes = {
            success: { class: 'alert-success', icon: 'fas fa-check-circle', color: '#48bb78' },
            warning: { class: 'alert-warning', icon: 'fas fa-exclamation-triangle', color: '#ed8936' },
            error: { class: 'alert-error', icon: 'fas fa-times-circle', color: '#f56565' },
            info: { class: 'alert-info', icon: 'fas fa-info-circle', color: '#4299e1' }
        };

        const alertConfig = alertTypes[type] || alertTypes.success;

        return `
            <div class="alert ${alertConfig.class}" style="
                padding: 20px;
                margin: 20px 0;
                border-radius: 10px;
                border-right: 4px solid ${alertConfig.color};
                background: ${type === 'success' ? '#f0fff4' : type === 'warning' ? '#fffaf0' : type === 'error' ? '#fff5f5' : '#ebf8ff'};
                color: ${type === 'success' ? '#22543d' : type === 'warning' ? '#c05621' : type === 'error' ? '#c53030' : '#2c5282'};
                display: flex;
                align-items: flex-start;
                gap: 15px;
            ">
                <i class="${alertConfig.icon}" style="font-size: 20px; margin-top: 2px;"></i>
                <div>
                    <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${title}</h4>
                    <p style="margin: 0; line-height: 1.5;">${message}</p>
                </div>
            </div>
        `;
    }

    /**
     * إنشاء مكون الاقتباس
     */
    createQuoteComponent(text = 'هذا اقتباس مهم من نص أو شخصية معروفة.', author = 'المؤلف', source = '') {
        return `
            <blockquote style="
                border-right: 4px solid #667eea;
                padding: 25px 30px;
                margin: 30px 0;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-radius: 0 15px 15px 0;
                position: relative;
                font-style: italic;
                font-size: 18px;
                line-height: 1.6;
                color: #4a5568;
            ">
                <p style="margin: 0 0 15px 0;">"${text}"</p>
                <cite style="
                    display: block;
                    text-align: left;
                    font-style: normal;
                    font-weight: 600;
                    color: #667eea;
                    font-size: 14px;
                ">
                    — ${author}${source ? `، ${source}` : ''}
                </cite>
            </blockquote>
        `;
    }

    /**
     * إنشاء مكون البطاقة
     */
    createCardComponent(title = 'عنوان البطاقة', content = 'محتوى البطاقة يكتب هنا...', image = '', footer = '') {
        return `
            <div class="card" style="
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 15px;
                padding: 25px;
                margin: 20px 0;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                overflow: hidden;
            ">
                ${image ? `
                    <div style="margin: -25px -25px 20px -25px;">
                        <img src="${image}" alt="${title}" style="width: 100%; height: 200px; object-fit: cover;">
                    </div>
                ` : ''}
                <h3 style="
                    margin: 0 0 15px 0;
                    color: #4a5568;
                    font-size: 20px;
                    font-weight: 600;
                ">${title}</h3>
                <p style="
                    margin: 0 0 20px 0;
                    color: #718096;
                    line-height: 1.6;
                ">${content}</p>
                ${footer ? `
                    <div style="
                        padding-top: 15px;
                        border-top: 1px solid #e2e8f0;
                        color: #a0aec0;
                        font-size: 14px;
                    ">${footer}</div>
                ` : ''}
            </div>
        `;
    }

    /**
     * إنشاء مكون الفاصل
     */
    createDividerComponent(style = 'gradient') {
        const styles = {
            gradient: 'background: linear-gradient(90deg, transparent, #667eea, transparent); height: 2px;',
            dots: 'background: repeating-linear-gradient(90deg, #667eea 0, #667eea 10px, transparent 10px, transparent 20px); height: 2px;',
            dashed: 'border-top: 2px dashed #667eea; height: 0;',
            solid: 'background: #667eea; height: 2px;'
        };

        return `
            <hr class="divider" style="
                border: none;
                ${styles[style] || styles.gradient}
                margin: 40px 0;
            ">
        `;
    }

    /**
     * إنشاء مكون الجدول الزمني
     */
    createTimelineComponent() {
        return `
            <div style="margin: 30px 0; position: relative;">
                <div style="
                    position: absolute;
                    right: 20px;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
                "></div>
                
                <div style="margin-bottom: 30px; position: relative; padding-right: 60px;">
                    <div style="
                        position: absolute;
                        right: 11px;
                        top: 5px;
                        width: 18px;
                        height: 18px;
                        background: #667eea;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 0 0 3px #667eea;
                    "></div>
                    <h4 style="margin: 0 0 8px 0; color: #4a5568;">المرحلة الأولى</h4>
                    <p style="margin: 0; color: #718096; line-height: 1.5;">وصف المرحلة الأولى من المشروع أو العملية.</p>
                </div>
                
                <div style="margin-bottom: 30px; position: relative; padding-right: 60px;">
                    <div style="
                        position: absolute;
                        right: 11px;
                        top: 5px;
                        width: 18px;
                        height: 18px;
                        background: #764ba2;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 0 0 3px #764ba2;
                    "></div>
                    <h4 style="margin: 0 0 8px 0; color: #4a5568;">المرحلة الثانية</h4>
                    <p style="margin: 0; color: #718096; line-height: 1.5;">وصف المرحلة الثانية من المشروع أو العملية.</p>
                </div>
                
                <div style="position: relative; padding-right: 60px;">
                    <div style="
                        position: absolute;
                        right: 11px;
                        top: 5px;
                        width: 18px;
                        height: 18px;
                        background: #48bb78;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 0 0 3px #48bb78;
                    "></div>
                    <h4 style="margin: 0 0 8px 0; color: #4a5568;">المرحلة الثالثة</h4>
                    <p style="margin: 0; color: #718096; line-height: 1.5;">وصف المرحلة الثالثة من المشروع أو العملية.</p>
                </div>
            </div>
        `;
    }

    /**
     * إنشاء مكون الأسعار
     */
    createPricingComponent() {
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0;">
                <div style="
                    background: white;
                    border: 2px solid #e2e8f0;
                    border-radius: 15px;
                    padding: 30px 20px;
                    text-align: center;
                    position: relative;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                ">
                    <h3 style="margin: 0 0 10px 0; color: #4a5568; font-size: 18px;">الخطة الأساسية</h3>
                    <div style="font-size: 36px; font-weight: 700; color: #667eea; margin: 20px 0;">$29</div>
                    <ul style="list-style: none; padding: 0; margin: 20px 0; text-align: right;">
                        <li style="padding: 8px 0; color: #718096;">ميزة أولى</li>
                        <li style="padding: 8px 0; color: #718096;">ميزة ثانية</li>
                        <li style="padding: 8px 0; color: #718096;">ميزة ثالثة</li>
                    </ul>
                    <button style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                        width: 100%;
                    ">اختيار الخطة</button>
                </div>
                
                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 15px;
                    padding: 30px 20px;
                    text-align: center;
                    position: relative;
                    transform: scale(1.05);
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
                ">
                    <div style="
                        position: absolute;
                        top: -10px;
                        right: 50%;
                        transform: translateX(50%);
                        background: #48bb78;
                        color: white;
                        padding: 5px 20px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                    ">الأكثر شعبية</div>
                    <h3 style="margin: 20px 0 10px 0; font-size: 18px;">الخطة المتقدمة</h3>
                    <div style="font-size: 36px; font-weight: 700; margin: 20px 0;">$59</div>
                    <ul style="list-style: none; padding: 0; margin: 20px 0; text-align: right;">
                        <li style="padding: 8px 0;">جميع الميزات الأساسية</li>
                        <li style="padding: 8px 0;">ميزات متقدمة</li>
                        <li style="padding: 8px 0;">دعم أولوية</li>
                    </ul>
                    <button style="
                        background: white;
                        color: #667eea;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                        width: 100%;
                    ">اختيار الخطة</button>
                </div>
            </div>
        `;
    }

    /**
     * إنشاء مكون الشهادات
     */
    createTestimonialComponent() {
        return `
            <div style="
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-radius: 15px;
                padding: 30px;
                margin: 30px 0;
                text-align: center;
                position: relative;
            ">
                <div style="
                    font-size: 48px;
                    color: #667eea;
                    margin-bottom: 20px;
                ">"</div>
                <p style="
                    font-size: 18px;
                    line-height: 1.6;
                    color: #4a5568;
                    margin: 0 0 20px 0;
                    font-style: italic;
                ">هذه شهادة من عميل راضٍ عن خدماتنا. نحن فخورون بجودة العمل الذي نقدمه.</p>
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                ">
                    <div style="
                        width: 60px;
                        height: 60px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 24px;
                        font-weight: 600;
                    ">أ.م</div>
                    <div>
                        <h4 style="margin: 0; color: #4a5568;">أحمد محمد</h4>
                        <p style="margin: 0; color: #718096; font-size: 14px;">مدير شركة التقنية</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * إنشاء مكون الأسئلة الشائعة
     */
    createFAQComponent() {
        return `
            <div style="margin: 30px 0;">
                <h3 style="text-align: center; margin-bottom: 30px; color: #4a5568;">الأسئلة الشائعة</h3>
                
                <div style="margin-bottom: 15px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <div style="
                        background: #f8fafc;
                        padding: 20px;
                        cursor: pointer;
                        font-weight: 600;
                        color: #4a5568;
                        border-bottom: 1px solid #e2e8f0;
                    ">ما هي مميزات هذا المنتج؟</div>
                    <div style="padding: 20px; color: #718096; line-height: 1.6;">
                        هذا المنتج يحتوي على العديد من المميزات الرائعة التي تجعله الخيار الأمثل لك.
                    </div>
                </div>
                
                <div style="margin-bottom: 15px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <div style="
                        background: #f8fafc;
                        padding: 20px;
                        cursor: pointer;
                        font-weight: 600;
                        color: #4a5568;
                        border-bottom: 1px solid #e2e8f0;
                    ">كيف يمكنني الحصول على الدعم؟</div>
                    <div style="padding: 20px; color: #718096; line-height: 1.6;">
                        يمكنك الحصول على الدعم من خلال فريقنا المختص عبر البريد الإلكتروني أو الهاتف.
                    </div>
                </div>
                
                <div style="margin-bottom: 15px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <div style="
                        background: #f8fafc;
                        padding: 20px;
                        cursor: pointer;
                        font-weight: 600;
                        color: #4a5568;
                        border-bottom: 1px solid #e2e8f0;
                    ">هل يوجد ضمان للمنتج؟</div>
                    <div style="padding: 20px; color: #718096; line-height: 1.6;">
                        نعم، نحن نقدم ضمان شامل لمدة سنة كاملة على جميع منتجاتنا.
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * إنشاء مكون معلومات الاتصال
     */
    createContactComponent() {
        return `
            <div style="
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 15px;
                padding: 30px;
                margin: 30px 0;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            ">
                <h3 style="text-align: center; margin-bottom: 30px; color: #4a5568;">معلومات الاتصال</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    <div style="text-align: center;">
                        <div style="
                            width: 60px;
                            height: 60px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 15px;
                            color: white;
                            font-size: 24px;
                        "><i class="fas fa-phone"></i></div>
                        <h4 style="margin: 0 0 8px 0; color: #4a5568;">الهاتف</h4>
                        <p style="margin: 0; color: #718096;">+966 50 123 4567</p>
                    </div>
                    
                    <div style="text-align: center;">
                        <div style="
                            width: 60px;
                            height: 60px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 15px;
                            color: white;
                            font-size: 24px;
                        "><i class="fas fa-envelope"></i></div>
                        <h4 style="margin: 0 0 8px 0; color: #4a5568;">البريد الإلكتروني</h4>
                        <p style="margin: 0; color: #718096;">info@example.com</p>
                    </div>
                    
                    <div style="text-align: center;">
                        <div style="
                            width: 60px;
                            height: 60px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 15px;
                            color: white;
                            font-size: 24px;
                        "><i class="fas fa-map-marker-alt"></i></div>
                        <h4 style="margin: 0 0 8px 0; color: #4a5568;">العنوان</h4>
                        <p style="margin: 0; color: #718096;">الرياض، المملكة العربية السعودية</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * إنشاء مكون المعرض
     */
    createGalleryComponent() {
        return `
            <div style="margin: 30px 0;">
                <h3 style="text-align: center; margin-bottom: 30px; color: #4a5568;">معرض الصور</h3>
                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                ">
                    <div style="
                        aspect-ratio: 1;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 48px;
                        cursor: pointer;
                        transition: transform 0.3s ease;
                    "><i class="fas fa-image"></i></div>
                    <div style="
                        aspect-ratio: 1;
                        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 48px;
                        cursor: pointer;
                        transition: transform 0.3s ease;
                    "><i class="fas fa-image"></i></div>
                    <div style="
                        aspect-ratio: 1;
                        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 48px;
                        cursor: pointer;
                        transition: transform 0.3s ease;
                    "><i class="fas fa-image"></i></div>
                    <div style="
                        aspect-ratio: 1;
                        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 48px;
                        cursor: pointer;
                        transition: transform 0.3s ease;
                    "><i class="fas fa-image"></i></div>
                </div>
            </div>
        `;
    }

    /**
     * الحصول على مكون بالاسم
     */
    getComponent(name, ...args) {
        const creator = this.components.get(name);
        if (creator) {
            return creator.apply(this, args);
        }
        return '';
    }

    /**
     * الحصول على قائمة المكونات المتاحة
     */
    getAvailableComponents() {
        return Array.from(this.components.keys());
    }
}

// إنشاء مثيل مدير المكونات
const componentManager = new ComponentManager();

// تصدير للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentManager;
}
