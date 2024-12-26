function updateDeliveryCost() {
    const wilaya = document.getElementById('wilaya').value;
    const deliveryCostInput = document.getElementById('deliveryCost');
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const deliveryCosts = {
        "الجزائر": 400,
        "البليدة": 600,
        "بومرداس": 600,
        "باتنة": 750,
        "بجاية": 750,
        "قسنطينة": 750,
        "الشلف": 750,
        "ميلة": 800,
        "وهران": 750,
        "سكيكدة": 750,
        "تيزي وزو": 750,
        "المدية": 750,
        "سيف": 750,
        "جيجل": 800,
        "عين دفلة": 800,
        "غليزان": 800,
        "قالمة": 800,
        "تيسمسيلت": 800,
        "تيارت": 800,
        "تبسة": 900,
        "ريليزي": 800,
        "أم البواقي": 800,
        "المستغانم": 800,
        "عين تموشنت": 800,
        "الطارف": 800,
        "تلمسان": 800,
        "سوق أهراس": 800,
        "سيدي بلعباس": 800,
        "الأغواط": 1100,
        "سعيدة": 800,
        "غرداية": 950,
        "الوادي": 950,
        "الجلفة": 900,
        "بسكرة": 900,
        "تقرت": 900,
        "ورقلة": 900,
        "بشار": 1000,
        "المغير": 900,
        "البيض": 1100,
        "أولاد جلال": 900,
        "النعامة": 1100,
        "المنيعة": 950,
        "بني عباس": 1100,
        "تيميمون": 1400,
        "أدرار": 1200,
        "عين صلاح": 1500,
        "تندوف": 1400,
        "جانت": 1200,
        "عين صالح": 1500,
        "تيبازة": 650,
        "خنشلة": 850,
        "برج بوعريريج": 800,
        "عنابة": 800,
        "المسيلة": 850,
        "معسكر": 800,
        "تمنراست": 1400,
        "البويرة": 850,
        "سطيف": 800,
    };

    if (deliveryCosts[wilaya]) {
        const cost = deliveryCosts[wilaya] * quantity;
        deliveryCostInput.value = `دج ${cost}`;
        updateTotalCost();
    } else {
        deliveryCostInput.value = 'لا توجد تكلفة توصيل للولاية المختارة';
    }
}




document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    if (productId) {
        displayProductDetails(productId);
    } else {
        fetchData()
            .then(data => {
                if (data && data.data) {
                    displayProducts(data.data);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                displayError('حدث خطأ أثناء تحميل البيانات. تأكد من اتصالك بالإنترنت وحاول مجددًا.');
            });
    }

    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.removeEventListener('submit', submitOrder);
        orderForm.addEventListener('submit', submitOrder);
    }

    document.getElementById('city').addEventListener('change', updateDeliveryCost);
    document.getElementById('quantity').addEventListener('input', updateDeliveryCost);
});

async function fetchData() {
    const apiUrl = 'product.json'; // Ensure this is the correct path to your JSON file
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        localStorage.setItem('products', JSON.stringify(data.data));
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
function submitOrder(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const phoneInput = document.getElementById('phone');
    const phoneValue = phoneInput.value;

    // Check if the phone number is exactly 10 digits
    if (!/^\d{10}$/.test(phoneValue)) {
        alert('يرجى التأكد من الرقم. يجب أن يحتوي على 10 أرقام.');
        phoneInput.focus();
        return false;
    }

    // Check if required fields are filled
    const productId = document.getElementById('product-id').value;
    const deliveryCost = document.getElementById('deliveryCost').value;
    const total = document.getElementById('total').value;
    const size = document.getElementById('size').value;
    const color = document.getElementById('color').value;
    const name = document.getElementById('name').value;
    const wilaya = document.getElementById('wilaya').value;
    const commune = document.getElementById('address').value;

    if (!productId || !deliveryCost || !total || !size || !color || !name || !wilaya || !commune) {
        alert('يرجى ملء جميع الحقول المطلوبة.');
        return false;
    }

    // Proceed with form submission
    document.getElementById('loading-message').style.display = 'block'; // Show loading message

    const form = event.target;
    const formData = new FormData(form);

    fetch(form.action, {
        method: form.method,
        body: formData,
    })
        .then(response => response.text())  // Get the response text
        .then(data => {
            if (data.includes('تم تقديم الطلب بنجاح!')) {
                window.location.href = 'success.html'; // Redirect to success page
            } else {
                alert(data); // Show error message from server response
            }
        })
        .catch(error => {
            console.error('Error submitting order:', error);
            alert('حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مرة أخرى.');
        })
        .finally(() => {
            document.getElementById('loading-message').style.display = 'none'; // Hide loading message
            form.reset(); // Optionally reset the form
        });
}





function displayProducts(products) {
    const dataContainer = document.getElementById('data-container');
    if (!dataContainer) {
        console.error('Element with id "data-container" not found.');
        return;
    }
    dataContainer.innerHTML = '';

    if (Array.isArray(products) && products.length > 0) {
        products.forEach(product => {
            const dataCard = document.createElement('div');
            dataCard.className = 'product-card';
            dataCard.dataset.productId = product.id;

            const title = document.createElement('h3');
            title.textContent = product.attributes.Title || 'لا يوجد عنوان';

            const price = document.createElement('span');
            price.textContent = `السعر: ${product.attributes.Price || 'لا يوجد سعر'} دج`;

            const imageContainer = document.createElement('div');
            imageContainer.className = 'data-image';
            const imageUrl = product.attributes.Image?.data?.[0]?.attributes?.formats?.thumbnail?.url;
            if (imageUrl) {
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = product.attributes.Title || 'لا توجد صورة';
                imageContainer.appendChild(imgElement);
            } else {
                imageContainer.innerHTML = '<p>لا توجد صورة.</p>';
            }

            dataCard.appendChild(imageContainer);
            dataCard.appendChild(title);
            dataCard.appendChild(price);

            const orderButton = document.createElement('a');
            orderButton.className = 'order-btn';
            orderButton.textContent = 'اشترِ الآن';
            orderButton.href = `order.html?productId=${product.id}`;

            dataCard.appendChild(orderButton);

            dataCard.addEventListener('click', () => {
                window.location.href = `order.html?productId=${product.id}`;
            });

            dataContainer.appendChild(dataCard);
        });
    } else {
        dataContainer.innerHTML = '<p>لا توجد منتجات لعرضها.</p>';
    }
}



function displayProductDetails(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);

    if (product) {
        const productTitle = document.querySelector('#product-title');
        const productDescription = document.querySelector('#product-description');
        const productPrice = document.querySelector('#product-price');
        const productSize = document.querySelector('#product-size');
        const productColor = document.querySelector('#product-color');
        const productImagesContainer = document.querySelector('#thumbnail-gallery');
        const productIdField = document.getElementById('product-id');
        const deliveryCostField = document.getElementById('deliveryCost');
        const totalField = document.getElementById('total');
        const mainImage = document.getElementById('main-image');

        if (productTitle) productTitle.textContent = product.attributes.Title || 'لا يوجد عنوان';
        if (productDescription) productDescription.textContent = product.attributes.Description || 'لا يوجد وصف';
        if (productPrice) productPrice.textContent = `السعر: ${product.attributes.Price || 'لا يوجد سعر'} دج`;
        if (productSize) productSize.textContent = `المقاس: ${product.attributes.Size || 'لا يوجد مقاس'}`;
        if (productColor) productColor.textContent = `اللون: ${product.attributes.Color || 'لا يوجد لون'}`;
        if (productIdField) productIdField.value = product.id || 'لا يوجد معرف';

        if (productImagesContainer) productImagesContainer.innerHTML = '';

        const images = product.attributes.Image?.data || [];
        const colors = product.attributes.Color?.split(' ') || [];

        if (images.length > 0) {
            const defaultImageUrl = images[0].attributes?.formats?.thumbnail?.url || 'default-image.jpg';
            if (mainImage) {
                mainImage.src = defaultImageUrl;
                mainImage.alt = product.attributes.Title || 'صورة المنتج';
            }

            // داخل دالة displayProductDetails

            images.forEach((image, index) => {
                const imageUrl = image.attributes?.formats?.thumbnail?.url;
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl || 'default-image.jpg';
                imgElement.alt = product.attributes.Title || 'صورة المنتج';
                imgElement.className = 'thumbnail'; // تأكد من استخدام نفس الاسم الذي قمت بتعريفه في CSS
                imgElement.addEventListener('click', () => {
                    if (mainImage) {
                        mainImage.src = imageUrl || 'default-image.jpg';
                        mainImage.alt = product.attributes.Title || 'صورة المنتج';
                    }
                });
                productImagesContainer.appendChild(imgElement);
            });

        } else {
            productImagesContainer.innerHTML = '<p>لا توجد صور.</p>';
        }

        const sizeSelect = document.getElementById('size');
        if (sizeSelect) {
            sizeSelect.innerHTML = '';
            product.attributes.Size?.split(' ').forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                sizeSelect.appendChild(option);
            });
        }

        const colorSelect = document.getElementById('color');
        if (colorSelect) {
            colorSelect.innerHTML = '';
            colors.forEach(color => {
                const option = document.createElement('option');
                option.value = color;
                option.textContent = color;
                colorSelect.appendChild(option);
            });
        }

        updateDeliveryCost(); // Ensure delivery cost is updated with the product
    } else {
        displayError('المنتج غير موجود.');
    }
}












function updateTotalCost() {
    const deliveryCost = parseInt(document.getElementById('deliveryCost').value.replace('دج ', '')) || 0;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const productPrice = parseInt(document.getElementById('product-price').textContent.replace('السعر: ', '').replace(' دج', '')) || 0;
    const total = (productPrice * quantity) + deliveryCost;
    document.getElementById('total').value = `دج ${total}`;
    document.getElementById('wilaya').addEventListener('change', updateDeliveryCost);
    document.getElementById('quantity').addEventListener('input', updateDeliveryCost);

}



// دالة لعرض رسالة خطأ
function displayError(message) {
    const errorContainer = document.getElementById('error-message');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    } else {
        alert(message);
    }
}
// Fetch products from local storage or initialize as an empty array
let products = JSON.parse(localStorage.getItem('products')) || [];

// Function to filter products based on the search input
function filterProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product => {
        const title = product.attributes.Title.toLowerCase();
        const description = product.attributes.Description.toLowerCase();
        return title.includes(searchInput) || description.includes(searchInput);
    });

}

// Function to toggle the visibility of the search input field
function toggleSearchInput() {
    const searchInput = document.getElementById('search-input');
    if (searchInput.classList.contains('visible')) {
        searchInput.classList.remove('visible');
        searchInput.value = ''; // مسح النص عند إخفاء الحقل
        filterProducts(); // تطبيق الفلترة بعد الإخفاء
    } else {
        searchInput.classList.add('visible');
        searchInput.focus(); // التركيز على الحقل عند عرضه
        filterProducts(); // عرض جميع المنتجات مبدئيًا
    }
}
// Function to filter products based on search input
// Function to filter products based on search input
function filterProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    // If the input has less than 2 characters, display all products
    if (searchInput.length < 1) {
        displayProducts(products); // عرض جميع المنتجات
        return;
    }

    const filteredProducts = products.filter(product => {
        const title = product.attributes.Title.toLowerCase();
        const description = product.attributes.Description.toLowerCase();
        return title.includes(searchInput) || description.includes(searchInput);
    });

    // Display the filtered products
    displayProducts(filteredProducts);
}

// Event listener for the search icon click to toggle the search input
document.getElementById('search-icon').addEventListener('click', toggleSearchInput);

// Event listener for input change to filter products
document.getElementById('search-input').addEventListener('input', filterProducts);

// Call filterProducts on page load to display all products initially
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products); // عرض جميع المنتجات عند تحميل الصفحة
});



// إضافة مستمع لتحديث تكلفة التوصيل عند تغيير المدينة أو الكمية
document.getElementById('city').addEventListener('change', updateDeliveryCost);
document.getElementById('quantity').addEventListener('input', updateDeliveryCost);



// تعبئة بيانات المنتج
document.getElementById('product-title').textContent = productData.attributes.Title;
document.getElementById('product-description').textContent = productData.attributes.Description;
document.getElementById('product-price').textContent = `السعر: ${productData.attributes.Price} دج`;
document.getElementById('product-id').value = productData.id;

function showCommunes() {
    var wilayaSelect = document.getElementById("wilaya");
    var communeSelect = document.getElementById("address");

    // مسح البلديات السابقة
    communeSelect.innerHTML = '<option value="" disabled selected>اختر البلدية</option>';

    var selectedWilaya = wilayaSelect.value;

    var communes = {
        "الجزائر": [
            "باب الوادي",
            "حسين داي",
            "بوزريعة",
            "الجزائر الوسطى",
            "الدويرة",
            "المرادية",
            "الشراقة",
            "البرج",
            "الجزائر الوسطى",
            "الخرايسية",
            "الحمامات",
            "الكاليتوس",
            "الشرقية",
            "المحمدية",
            "البلدية الجديدة",
            "البرج",
            "الجزائر شرق"
        ],
        "البليدة": [
            "البليدة",
            "الأخضرية",
            "برج خدية",
            "برج الكيفان",
            "بوفاريك",
            "بوينان",
            "بئر مراد رايس",
            "بني تامو",
            "المدية",
            "مفتاح",
            "شفة",
            "دليس",
            "الشريعة",
            "وادي العلايق",
            "سيدي موسى",
            "العفرون",
            "المقارين",
            "المحمدية",
            "البرج",
            "العمارية",
            "الطاهير",
            "البرج"
        ]
        ,
        "أدرار": [
            "أدرار",
            "أولاد سعيد",
            "أولاد زواي",
            "أولاد ميمون",
            "أولاد جلال",
            "أولاد عمار",
            "أولاد مسعود",
            "أولاد عياد",
            "أولاد مصطفى",
            "أولاد علي",
            "أولاد بوسعيد",
            "أولاد حمد",
            "أولاد النعمان",
            "أولاد فاطمة",
            "أولاد بن عياد",
            "أولاد سعيد",
            "أولاد مصطفى",
            "أولاد عياد",
            "أولاد عمار",
            "أولاد عويس",
            "أولاد زواي",
            "أولاد زكري",
            "أولاد ميمون",
            "أولاد شعيب",
            "أولاد عمار",
            "أولاد البشير",
            "أولاد النعمان",
            "أولاد سيدي إبراهيم",
            "أولاد سعيد"
        ],
        "وهران": [
            "وهران",
            "أرجي",
            "عين الترك",
            "بطيوة",
            "السانيا",
            "المسرغين",
            "المرسى",
            "الحاسي",
            "مفتاح",
            "سيدي الشحمي",
            "سيدي البشير",
            "سيدي عبد الرحمان",
            "سيدي لزرق",
            "سيدي خروبي",
            "سيدي يحيى",
            "الماي",
            "تنس",
            "القديد",
            "المشرية",
            "الجرف",
            "الحمادية",
            "الزهراء",
            "المطمر",
            "خميس مليانة",
            "سيدي مزغيش",
            "فرندة",
            "بوسعادة",
            "قصر البخاري"
        ], "الشلف": [
            "الشلف",
            "أولاد فارس",
            "باب العسة",
            "بوقادير",
            "بني بوعتاب",
            "بني حواء",
            "بني مليكش",
            "الشطية",
            "العبادية",
            "المرسى",
            "الطاهير",
            "عين الشهداء",
            "البرواقية",
            "عين الدفلى",
            "عين السبع",
            "الحمادية",
            "الزياتين",
            "الزريزر",
            "الجزائر",
            "بوقرة",
            "بئر الشهداء",
            "بئر خادم",
            "تاجنة",
            "طولقة",
            "تاجنة",
            "تحقيق",
            "تسالة",
            "تسالة"
        ], "الأغواط": [
            "الأغواط",
            "أفلو",
            "العمراوي",
            "المدية",
            "بريش",
            "بلدية المحمدية",
            "جلفة",
            "سيدي مخلوف",
            "سيدي عبد الله",
            "سيدي الهادي",
            "سيدي خالد",
            "سيدي نصر الدين",
            "عين ماضي",
            "عين الملوك",
            "عين قادوس",
            "عين الرومية",
            "دلدول",
            "قصر البخاري",
            "قصر الحيران",
            "قصر الشلالة",
            "قصر العتيق",
            "قصر الربع",
            "قصر فلاح",
            "قصر قدور",
            "قصر مولاي",
            "المسعودية"
        ],
        "أم البواقي": [
            "أم البواقي",
            "عين مليلة",
            "عين البيضاء",
            "عين كرشة",
            "عين فكرون",
            "فجوج",
            "قالمة",
            "قصر الشلالة",
            "قصر البر",
            "قصر الثلث",
            "قصر العتيق",
            "قصر بن عيسى",
            "قصر بلحسن",
            "مشتة",
            "مدينة شطايبي",
            "بريكة",
            "دائرة الجرف",
            "خنشلة",
            "بومهرة",
            "بومعوش",
            "بومهدي",
            "بومعيزة",
            "بومصطفى",
            "بومهدية",
            "بوحمدية",
            "بوغلب",
            "بوقرنين",
            "بوحمامة"
        ],
        "باتنة": [
            "باتنة",
            "أريس",
            "أولاد عمار",
            "أولاد سي أحمد",
            "أولاد سلامة",
            "أولاد زواد",
            "بريكة",
            "بومقر",
            "بوقاعة",
            "بوخليفة",
            "بوحمدان",
            "بوحنيش",
            "بوحمزة",
            "بوغاي",
            "بومهرة",
            "بونورة",
            "تيجديت",
            "تيتمشي",
            "جزار",
            "جلال",
            "خليفة",
            "خراطة",
            "دوار أولاد سعيد",
            "دوار أولاد سبتي",
            "دوار شرفا",
            "دوار زمالة",
            "دوار سعيد",
            "دوار عزيز",
            "دوار عيسى",
            "دوار غريب",
            "دوار قصر",
            "دوار كداري",
            "دوار مازونة",
            "دوار مالك",
            "دوار مشوخة",
            "دوار نجارة",
            "دوار نسابة",
            "دوار واد الذهب",
            "دوار واد الكبير",
            "دوار وادي العثمان",
            "دوار وادي الربيع",
            "دوار وادي سيدي",
            "دوار وادي سيدي الشيخ",
            "دوار وادي فاطمة",
            "دوار وادي مري",
            "دوار وادي نهر",
            "دوار وادي درب",
            "دوار وادي الطيور",
            "دوار وادي القصب",
            "دوار وادي الميسر",
            "دوار وادي المرفود",
            "دوار وادي الزار"
        ], "بجاية": [
            "بجاية",
            "آيت يحيى",
            "آيت بوسعيد",
            "آيت مناصر",
            "آيت إسماعيل",
            "آيت دراج",
            "آيت سعدون",
            "آيت طاهر",
            "آيت سعادة",
            "آيت زاهر",
            "آيت مازغاش",
            "آيت زين الدين",
            "آيت زعرير",
            "آيت شبير",
            "بني معوش",
            "بني يني",
            "بني فودة",
            "بني عور",
            "بني كيل",
            "بني عبد الله",
            "بني نصر",
            "بني قصير",
            "بني جليل",
            "بني مارد",
            "بني عزيز",
            "بني سليمان",
            "بني زيد",
            "بني رحال",
            "بني سليمان",
            "بني زين الدين",
            "بني منقاد",
            "بني بوسعيد",
            "بني موسى",
            "بني موسى",
            "بني مزة",
            "بني عبد الله",
            "بني عمران",
            "بني وسان",
            "بني هارون",
            "بني سمي",
            "بني بوزيد",
            "بني زكريا",
            "بني سليمان",
            "بني سالم",
            "بني طلحة",
            "بني عيسى",
            "بني آزيك",
            "بني زيد",
            "بني يحيى",
            "بني عيش",
            "بني زيد"
        ],
        // أضف هنا البلديات لكل ولاية
    };

    // التأكد من وجود البلديات لهذه الولاية
    if (communes[selectedWilaya]) {
        // إضافة البلديات إلى القائمة
        communes[selectedWilaya].forEach(function (commune) {
            var option = document.createElement("option");
            option.value = commune;
            option.text = commune;
            communeSelect.appendChild(option);
        });
    }
}