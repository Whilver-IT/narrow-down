'use strict'

;class PageUtils {

    static #pageList = [
        'index',
        'menu',
        'profilelist',
        'profile',
        'purposelist',
        'purpose',
        'structure-datalist',
        'structure-data',
        'structure-jsonlist',
        'structure-json',
        'narrow-downlist',
        'narrow-down',
        'logiclist',
        'logic',
        'sqllist',
        'sql',
        'conclusionlist',
        'conclusion',
        'bonuslist',
        'bonus',
        'combinationlist',
        'combination',
        'recursionlist',
        'recursion',
        'bitcountlist',
        'bitcount',
    ] 

    static #menuList = [
        '自己紹介',
        '本内容を掲載しようと思った経緯・目的など',
        '構成要素(データ構造)',
        '構成要素(JSON)',
        '検索の条件の絞り込み方',
        '具体的なロジック',
        'デバッグ時に役に立つSQL',
        'まとめ',
        'おまけ(デバッグにおけるコンビネーション、再帰、ビットカウントなど)',
        'コンビネーション',
        '再帰',
        'ビットカウント',
    ]
    
    static #footerMsg = [
        'Whilver&ensp;ITが提供なく孤独にお送りしています!!',
        'Whilver&ensp;ITが明日の風を吹かせる存在でありたい!!',
        'Whilver&ensp;ITが今日あるのは皆様のおかげです!!',
    ]

    static setHeader() {
        const header = document.createElement('div')
        header.classList.add('header')
        const bannerDiv = document.createElement('div')
        const banner = document.createElement('img')
        return new Promise((resolve, reject) => {
            banner.addEventListener('load', (e) => {
                bannerDiv.append(banner)
                header.append(bannerDiv)
                document.querySelector('body').prepend(header)
                resolve()
            })
            banner.src = 'img/banner.jpg'
        })
    }

    static htmlspecialchars(str) {
        return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
    }

    static #getNowPage() {
        const pathname = location.pathname == '/' ? '/index.html' : location.pathname
        const pos = pathname.lastIndexOf('/')
        return (pos == -1 ? pathname : pathname.substring(pos + 1)).replace('.html', '')
    }

    static getMovePage(direction) {
        const curr = PageUtils.#getNowPage()
        const index = PageUtils.#pageList.indexOf(curr)
        let nextPage = null
        if (index != -1 && index + direction >= 0 && index + direction < PageUtils.#pageList.length) {
            const href = location.pathname == '/' ? (location.href + 'index.html') : location.href
            nextPage = href.replace(curr + '.html', PageUtils.#pageList[index + direction] + '.html')
        }
        return nextPage
    }

    static setMenu(){
        const list = document.querySelector(".list")
        if(list){
            const title = document.querySelector("title")
            const titleMenu = document.querySelector(".title")
            const h1 = document.createElement('h1')
            h1.innerHTML = 'お品書き'
            titleMenu.appendChild(h1)
            const curr = PageUtils.#getNowPage()
            const listPages = PageUtils.#pageList.filter((value, index) => {
                return value.substring(value.length - 4) == "list"
            })
            PageUtils.#menuList.forEach((value, index) => {
                const li = document.createElement("li")
                li.innerHTML = PageUtils.htmlspecialchars(value)
                if(curr == "menu"){
                    if(title && !title.innerHTML && titleMenu){
                        title.innerHTML = titleMenu.innerHTML.trim().replaceAll('<h1>', '').replaceAll('</h1>', '')
                    }
                } else {
                    const pos = listPages.indexOf(curr)
                    if(pos != -1 && pos != index){
                        li.classList.add("listblurred")
                    } else {
                        if(title && !title.innerHTML && titleMenu){
                            title.innerHTML = titleMenu.innerHTML.trim().replaceAll('<h1>', '').replaceAll('</h1>', '') + "(" + value + ")"
                        }
                    }
                }
                list.appendChild(li)
            })
        }
    }

    static setHeight() {
        const container = document.querySelector('.container')
        const footer = document.querySelector('footer')
        if (container && footer) {
            if (window.innerHeight > footer.getBoundingClientRect().top) {
                const targetElem = container.children ? container.children[0] : container
                const height = window.innerHeight - footer.getBoundingClientRect().bottom
                targetElem.style.height = (targetElem.getBoundingClientRect().height + height) + 'px'
                if ([...targetElem.classList].indexOf('main') != -1) {
                    targetElem.classList.remove('visible')
                    targetElem.classList.add('visible')
                }
            }
        }
        footer.innerHTML = PageUtils.#footerMsg[Math.floor(Math.random()) * PageUtils.#footerMsg.length]
        footer.classList.remove('visible')
        footer.classList.add('visible')
    }
}

const resize = (e) => {
    PageUtils.setHeader().then(() => {
        PageUtils.setMenu()
        PageUtils.setHeight()
    })

    document.addEventListener('resize', () => {
        PageUtils.setHeight()
    })
}

document.addEventListener('DOMContentLoaded', resize)
document.addEventListener('DOMContentLoaded', (dcl) => {
    window.addEventListener('keydown', (e) => {
        const direction = (e.code == 'KeyP' || e.code == 'ArrowLeft') ? -1 : ((e.code == 'Enter' || e.code == 'ArrowRight') ? 1 : 0)
        if (direction) {
            const nextPage = PageUtils.getMovePage(direction)
            if (nextPage) {
                location.href = nextPage
            }
        }
    })
})
