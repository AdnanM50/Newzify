import User from '../modules/user/user.model';
import Setting from '../modules/setting/setting.model';
import Language from '../modules/setting-language/setting-language.model';
import Page from '../modules/setting-page/setting-page.model';


// @ts-ignore
export const seedAdmin = async ({ adminInfo, valueString }) => {
    const { name, email, phone, password } = adminInfo;
    const { WEBSITE_NAME } = valueString;
    const user = await User.findOne({ role: 'admin' }, { _id: 0 });
    const setting = await Setting.findOne({});
    const language = await Language.findOne({});
    const page = await Page.findOne({});
    //create admin -- >
    if (!user) {
        await User.create({
            name,
            email,
            phone,
            password,
            role: 'admin',
        });
    }
    // create siteSettings --->
    if (!setting) {
        await Setting.create({
            site_name: WEBSITE_NAME,
            site_email: 'admin@example.com',
            site_phone: '01998311602',
            site_logo: '',
            site_address: '',
            site_description: '',
            site_footer: '',
            currency_code: 'USD',
            currency_symbol: '$',
            client_side_url: 'http://localhost:3000',
            server_side_url: 'http://localhost:5000',
            otp_verification_type: 'email',
            file_upload_type: 'local',
            email_config: {
                default: 'gmail',
                gmail: {
                    auth_email: 'your-email@gmail.com',
                    password: 'your-app-password',
                    service_provider: 'gmail',
                },
                sendgrid: {
                    host: '',
                    port: 587,
                    username: '',
                    password: '',
                    sender_email: '',
                },
            },
            phone_config: {
                twilio_auth_token: '',
                twilio_sender_number: '',
                twilio_account_sid: '',
                is_active: false,
            },
            stripe: {
                credentials: {
                    stripe_publishable_key: '',
                    stripe_secret_key: '',
                    stripe_webhook_secret: '',
                },
                is_active: false,
                logo: '',
                name: '',
            },
            paypal: {
                credentials: {
                    paypal_base_url: '',
                    paypal_client_id: '',
                    paypal_secret_key: '',
                },
                is_active: false,
                logo: '',
                name: '',
            },
            razorpay: {
                credentials: {
                    razorpay_key_id: '',
                    razorpay_key_secret: '',
                },
                is_active: false,
                logo: '',
                name: '',
            },
            social_media_link: [],
            partner: [],
            otp_required: true,
        });
    }

    if (!language) {
        await Language.create({
            name: 'English',
            code: 'en',
            active: true,
            flag: 'us',
            default: true,
        });
    }
    // create new page -->
    const pages = [
        {
            slug: 'terms_and_conditions',
            status: true,
        },
        {
            slug: 'privacy_policy',
            status: true,
        },
        {
            slug: 'about',
            status: true,
        },
        {
            slug: 'contact_us',
            status: true,
        },
        {
            slug: 'home_page',
            theme: 'one',
            status: true,
            content: {
                hero: {
                    heading: 'string',
                    description: 'string',
                    short_description: 'string',
                    image1: 'string',
                    image2: 'string',
                    image3: 'string',
                    video: 'string',
                },
                about: {
                    heading: 'string',
                    description: 'string',
                    image: 'string',
                },
            },
        },
        {
            slug: 'home_page',
            theme: 'two',
            status: false,
            content: {
                hero: {
                    heading: 'string',
                    description: 'string',
                    short_description: 'string',
                    image1: 'string',
                    image2: 'string',
                    image3: 'string',
                    video: 'string',
                },
            },
        },
        {
            slug: 'home_page',
            theme: 'three',
            status: false,
            content: {
                hero: {
                    heading: 'string',
                    description: 'string',
                    image1: 'string',
                    image2: 'string',
                    image3: 'string',
                },
            },
        },
    ];
    console.log(pages);
    if (!page) {
        await Page.insertMany(pages);
        console.log("page setting is created successfully.");
    }
};

export const seeders = async () => {
    const adminInfo = {
        name: 'Admin',
        email: 'admin@example.com',
        phone: '01998311602',
        password: '123456',
    };
    const valueString = {
        WEBSITE_NAME: 'Shopstick Pro',
    };
    await seedAdmin({ adminInfo, valueString });
};
