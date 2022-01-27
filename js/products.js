let productModal = null;
let delProductModal = null;
const vm = Vue.createApp({
    data() {
        return {
            // 產品資料格式
            products: [],
            tempProduct: {
                imagesUrl: [],
            },
            //isNew判斷是「新增產品」或「編輯產品」
            isNew: false,
            // delItemId: '',
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            path: 'popeye',
        }
    },
    methods: {
        //確認是否登入
        checkLogin() {
            // this.url要加上，不然沒有cookie的時候，不會導向登入頁面
            axios.post(`${this.apiUrl}/api/user/check`)
                .then((res) => {
                    console.log(res.data);
                    this.getData();
                }).catch((err) => {
                    console.log(err);
                    window.location = 'index.html';
                })
        },
        //取得所有產品的資料，並渲染到網頁上
        getData() {
            const url = `${this.apiUrl}/api/${this.path}/admin/products/all`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                    console.log(this.products);
                })
                .catch(err => {
                    console.dir(err);
                    alert(err.data.message);
                })
        },

        //原來可以用一個函式同時處理「新增」與「修改」
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.path}/admin/product`;
            // 新增方法
            // let http = 'post';
            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.path}/admin/product/${this.tempProduct.id}`;
                // http = 'put';
                axios.put(url, { data: this.tempProduct })
                    .then(res => {
                        console.log(res);
                        alert(res.data.message);
                        productModal.hide();
                        this.getData();
                    })
                    .catch(err => {
                        console.dir(err);
                        alert(err.data.message);
                    })
            } else {
                axios.post(url, { data: this.tempProduct })
                    .then(res => {
                        console.log(res);
                        alert(res.data.message);
                        productModal.hide();
                        this.getData();
                    })
                    .catch(err => {
                        console.dir(err);
                        alert(err.data.message);
                    })
            }

        },
        openModal(newEditDel, item) {
            // 點擊「新增產品」，帶入的參數為 new
            if (newEditDel === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
                // 點擊「修改產品」，帶入的參數為 edit
            } else if (newEditDel === 'edit') {
                this.tempProduct = { ...item };
                //if (!this.isNew) 使用put方法
                this.isNew = false;
                productModal.show();
                // 點擊「刪除產品」，帶入的參數為 delete
            } else if (newEditDel === 'delete') {
                this.tempProduct = { ...item };
                console.log(this.tempProduct);
                delProductModal.show();
            }
        },
        // 刪除產品，介接API，隱藏刪除產品Modal
        delProduct() {
            const url = `${this.apiUrl}/api/${this.path}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then(res => {
                    console.log(res);
                    delProductModal.hide();
                    this.getData();
                })
                .catch(err => {
                    console.dir(err);
                    alert(err.data.message);
                })
        },
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
        // upLoadImg(e) {
        //     const url = `${this.apiUrl}/api/${this.path}/admin/upload`;
        //     const file = e.target.files[0];
        //     console.dir(file);
        //     const formData = new FormData();
        //     formData.append('file-to-upload', file);
        //     axios.post(url, formData)
        //         .then(res => {
        //             console.log(res.data.imageUrl);
        //             this.newProduct.imageUrl = res.data.imageUrl;
        //         })
        //         .catch(err => {
        //             console.log(err.response);
        //         })

        // },
    },
    mounted() {
        //取消按下 ESC 鍵時關閉 Bootstrape 互動視窗。
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false,
            backdrop: 'static'
        });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false,
            backdrop: 'static'
        });
        // 取得 Token（Token 僅需要設定一次）
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        console.log(token);
        axios.defaults.headers.common["Authorization"] = token;
        this.checkLogin()
    }
})
vm.mount('#app')