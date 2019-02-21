(function() {

    let galleryData = []

    let config = {
        // imgRoot: './'
        // imgRoot: 'https://raw.githubusercontent.com/Republix/DogeBackup/master/photos/',
        imgRoot: '',
        imgOnError: '/assets/img/empty.jpg'
    }

    let className = {
        groupItem: 'g-group', // 第一层循环
        groupTitle: 'gallery-title',
        galleryList: 'gallery-list',
        imgContainer: 'img-container',
        imgItem: 'img',
        imgEl: ''
    }

    let initialize = function () {
        if (!self.fetch) {
            console.log('%cnot support fetch', 'color: red')
            return
        }
        getGalleryJson(ajax = !self.fetch)
    }    
    
    let utils = {
        FormatDate: function (date, str = '') {
            if (!date) return str
            let _date = new Date(date)
            if (!_date) return str
            return (_date.getMonth() + 1) + '月  ' + _date.getFullYear()
        }
    }

    let startRender = function (data) {
        if (!data || !data.list) {
            console.log('noData', data)
            return
        }
        let dom = document.querySelector('.gallery-container')
        if (!dom) { }
        galleryData = data.list
        renderDom(dom)
    }

    let groupItemListFactory = function (dom, data) {
        data.forEach((elm) => {
            let _imgContainer = document.createElement('div')
            let _imgView = document.createElement('div')
            let _img = document.createElement('img')
            
            _imgContainer.setAttribute('class', className.imgContainer)
            _imgView.setAttribute('class', className.imgItem)
            _img.setAttribute('class', className.imgEl)
            _img.setAttribute('src', config.imgRoot + elm.link)
            _img.setAttribute('onerror', "javascript:this.src='" + (config.imgOnError + '') + "'")
            _img.setAttribute('alt', elm.title)
    
            _imgContainer.appendChild(_imgView)
            _imgView.appendChild(_img)
            dom.appendChild(_imgContainer)
        })
    }   
    /**
     * return groupDom
     * .gallery-title
     * .gallery-list
    */
    let groupDomFactory = function (data) {
        let g = document.createElement("div")
        // add group class
        let _class = document.createAttribute('class')
        _class.nodeValue = className.groupItem
        g.setAttributeNode(_class)
        // add group`s child -title
        let _title = document.createElement("div")
        _title.setAttribute('class', className.groupTitle)
        _title.innerHTML = utils.FormatDate(data.date)
        // add group`s child -list dom
        let _list = document.createElement("div")
        groupItemListFactory(_list, data.items || [])
        _list.setAttribute('class', className.galleryList)

        g.appendChild(_title)
        g.appendChild(_list)
        
        return g
    }

    function renderDom(dom) {
        let fragment = document.createDocumentFragment()
        galleryData.forEach((group) => {
            let g = groupDomFactory(group)
            g.appendChild
            fragment.appendChild(g)
        })
        dom.appendChild(fragment)
    }

    function getGalleryJson(ajax) {
        if (!ajax) {
            fetch('./gallery.json?', {
                method: "GET"
            }).then((res) => {
                res.json().then(data=> {
                    startRender(data)
                }, (err) => {
                })
            }).catch((err) => {
                console.log(err)
            })
        } else {
            let _xhr = new XMLHttpRequest()
            _xhr.open('GET', './gallery.json', true)
    
            _xhr.onreadystatechange = function (e) {}
            _xhr.onload = function (e) {
                try {
                    startRender(galleryData)
                } catch (e) {
                    console.log('parse json error when get AjaxJsonData')
                }
            }
            _xhr.onerror = function (err) {
                console.log(this.err)
            }
            _xhr.send()
        }
    }



    initialize()
})()