'use strict'

;const json = `
{
    "R01": {
        "P1|C1": {
            "J01": {
                "0": "I09",
                "1": "I11"
            },
            "J02": {
                "0": "I09"
            }
        }
    },
    "R02": {
        "P1|C1": {
            "J02": {
                "0": "I04",
                "1": "I09",
                "2": "I10",
                "3": "I12"
            },
            "J04": {
                "0": "I05"
            }
        }
    },
    "R03": {
        "P1|C1": {
            "J03": {
                "0": "I10",
                "1": "I12"
            },
            "J04": {
                "0": "I07",
                "1": "I12"
            },
            "J05": {
                "0": "I06",
                "1": "I09",
                "2": "I10",
                "3": "I12"
            }
        }
    },
    "R04": {
        "P1|C1": {
            "J03": {
                "0": "I10",
                "1": "I12"
            },
            "J04": {
                "0": "I12"
            },
            "J05": {
                "0": "I09",
                "1": "I10",
                "2": "I14"
            },
            "J06": {
                "0": "I06",
                "1": "I12",
                "2": "I15"
            }
        },
        "P1|C2": {
            "J06": {
                "0": "I08",
                "1": "I10",
                "2": "I12"
            }
        },
        "P2|C2": {
            "J06": {
                "0": "I06",
                "1": "I10",
                "2": "I12",
                "3": "I14",
                "4": "I15"
            }
        },
        "P4|C3": {
            "J05": {
                "0": "I12"
            },
            "J06": {
                "0": "I03",
                "1": "I04",
                "2": "I11",
                "3": "I12"
            },
            "J07": {
                "0": "I08"
            }
        }
    },
    "R05": {
        "P1|C1": {
            "J06": {
                "0": "I12",
                "1": "I14"
            },
            "J07": {
                "0": "I12"
            }
        },
        "P1|C2": {
            "J06": {
                "0": "I08"
            },
            "J07": {
                "0": "I12",
                "1": "I13"
            }
        },
        "P2|C2": {
            "J07": {
                "0": "I06",
                "1": "I12",
                "2": "I13",
                "3": "I14",
                "4": "I15"
            }
        },
        "P4|C2": {
            "J05": {
                "0": "I01",
                "1": "I02"
            }
        },
        "P4|C3": {
            "J07": {
                "0": "I06",
                "1": "I13"
            }
        }
    },
    "R06": {
        "P1|C1": {
            "J08": {
                "0": "I12",
                "1": "I13",
                "2": "I15"
            }
        },
        "P1|C2": {
            "J08": {
                "0": "I12",
                "1": "I13",
                "2": "I14",
                "3": "I15"
            },
            "J09": {
                "0": "I12"
            }
        },
        "P2|C2": {
            "J08": {
                "0": "I06",
                "1": "I12",
                "2": "I13",
                "3": "I14",
                "4": "I15",
                "5": "I16"
            },
            "J09": {
                "0": "I06",
                "1": "I12",
                "2": "I14"
            },
            "J10": {
                "0": "I04",
                "1": "I12"
            }
        },
        "P3|C2": {
            "J07": {
                "0": "I08"
            }
        },
        "P4|C3": {
            "J07": {
                "0": "I06",
                "1": "I13"
            }
        }
    },
    "R07": {
        "P1|C2": {
            "J09": {
                "0": "I12",
                "1": "I13",
                "2": "I14"
            },
            "J10": {
                "0": "I12"
            }
        },
        "P2|C2": {
            "J08": {
                "0": "I13"
            },
            "J09": {
                "0": "I06",
                "1": "I12",
                "2": "I13",
                "3": "I14",
                "4": "I15",
                "5": "I16"
            },
            "J10": {
                "0": "I04",
                "1": "I08",
                "2": "I09",
                "3": "I12"
            }
        },
        "P3|C2": {
            "J08": {
                "0": "I08"
            }
        },
        "P4|C3": {
            "J08": {
                "0": "I04",
                "1": "I12"
            }
        }
    },
    "R08": {
        "P1|C2": {
            "J09": {
                "0": "I13",
                "1": "I14"
            }
        },
        "P2|C2": {
            "J09": {
                "0": "I15"
            },
            "J10": {
                "0": "I06",
                "1": "I13"
            },
            "J11": {
                "0": "I04",
                "1": "I06",
                "2": "I12"
            }
        }
    },
    "R09": {
        "P2|C2": {
            "J11": {
                "0": "I04",
                "1": "I06",
                "2": "I12",
                "3": "I13"
            },
            "J12": {
                "0": "I09"
            }
        }
    },
    "R10": {
        "P2|C2": {
            "J11": {
                "0": "I06"
            }
        }
    }
}
`

document.addEventListener('DOMContentLoaded', (dcl) => {

    class Goods {

        /**
         * 元のjson格納用(parse後)
         */
        #json

        /**
         * 元のデータと表示用データ格納用
         */
        #data = {
            'base': {
                'r': [],
                'pc': [],
                'j': [],
                'i': {
                    'single': [],
                    'multi': [],
                },
            },

            'disp': {
                'r': [],
                'pc': [],
                'j': [],
                'i': [],
            }
        }

        // 選択されたデータを格納
        #selected = {
            'r': '',
            'pc': '',
            'j': '',
            'i': [],
        }

        /**
         * コンストラクタ
         * @param {*} json 
         */
        constructor(json) {
            this.#json = JSON.parse(json)
            this.#initialize()
        }

        /**
         * 選択された項目をセット
         * @param {*} setValue 
         */
        setSelected(valueItem) {
            if (valueItem['areaName'] == 'i') {
                if (this.#selected[valueItem['areaName']].includes(valueItem['value'])) {
                    this.#selected[valueItem['areaName']] = this.#selected[valueItem['areaName']].filter((item) => {
                        return valueItem['value'] != item
                    })
                } else {
                    this.#selected[valueItem['areaName']].push(valueItem['value'])
                }
                this.#selected[valueItem['areaName']].sort(this.#simpleSort)
            } else {
                if (typeof this.#selected[valueItem['areaName']] != 'undefined') {
                    this.#selected[valueItem['areaName']] = valueItem['value']
                }
            }
            this.narrowDown()
        }

        /**
         * 初期化
         */
        #initialize() {
            this.#data['base']['r'] = Object.keys(this.#json)
            for (const r in this.#json) {
                for (const pc in this.#json[r]) {
                    if (!this.#data['base']['pc'].includes(pc)) {
                        this.#data['base']['pc'].push(pc)
                    }
                    for (const j in this.#json[r][pc]) {
                        if (!this.#data['base']['j'].includes(j)) {
                            this.#data['base']['j'].push(j)
                        }
                        if (Object.keys(this.#json[r][pc][j]).length > 1) {   
                            const multi = Object.values(this.#json[r][pc][j])
                            if (!this.#data['base']['i']['multi'].some(item => JSON.stringify(item) == JSON.stringify(multi))) {
                                this.#data['base']['i']['multi'].push(multi)
                            }
                        }
                        for (const index in this.#json[r][pc][j]) {
                            if (!this.#data['base']['i']['single'].includes(this.#json[r][pc][j][index])) {
                                this.#data['base']['i']['single'].push(this.#json[r][pc][j][index])
                            }
                        }
                    }
                }
            }
            this.#data['base']['r'].sort(this.#simpleSort)
            this.#data['base']['pc'].sort(this.#pcSort)
            this.#data['base']['j'].sort(this.#simpleSort)
            this.#data['base']['i']['single'].sort(this.#simpleSort)
            this.#data['base']['i']['multi'].sort(this.#iSort)

            this.#data['disp']['r'] = JSON.parse(JSON.stringify(this.#data['base']['r']))
            this.#data['disp']['pc'] = JSON.parse(JSON.stringify(this.#data['base']['pc']))
            this.#data['disp']['j'] = JSON.parse(JSON.stringify(this.#data['base']['j']))
            this.#data['disp']['i'] = JSON.parse(JSON.stringify(this.#data['base']['i']['single']))
            
            for (const areaName in this.#data['disp']) {
                this.#setButton(areaName)
            }
        }

        /**
         * 単純なソート
         * @param {*} item1 
         * @param {*} item2 
         * @returns 
         */
        #simpleSort(item1, item2) {
            const prefix = item1.substring(0, 1)
            return item1.replaceAll(prefix, '') - item2.replaceAll(prefix, '') 
        }

        /**
         * PC項目のソート
         * @param {*} item1 
         * @param {*} item2 
         * @returns 
         */
        #pcSort(item1, item2) {
            const pc1 = item1.split('|')
            const pc2 = item2.split('|')
            if (pc1[0].replaceAll('P', '') > pc2[0].replaceAll('P', '')) {
                return 1
            }
            if (pc1[0].replaceAll('P', '') < pc2[0].replaceAll('P', '')) {
                return -1
            }
            if (pc1[1].replaceAll('P', '') > pc2[1].replaceAll('P', '')) {
                return 1
            }
            if (pc1[1].replaceAll('P', '') < pc2[1].replaceAll('P', '')) {
                return -1
            }
            return 0
        }

        /**
         * I項目のソート
         * @param {*} item1 
         * @param {*} item2 
         * @returns 
         */
        #iSort(item1, item2) {
            if (Object.keys(item1).length > Object.keys(item2).length) {
                return 1
            }
            if (Object.keys(item1).length < Object.keys(item2).length) {
                return -1
            }
            for (let i = 0; i < Object.keys(item1).length; i++) {
                if (item1[i].replaceAll('I', '') > item2[i].replaceAll('I', '')) {
                    return 1
                }
                if (item1[i].replaceAll('I', '') < item2[i].replaceAll('I', '')) {
                    return -1
                }
            }
            return 0
        }

        /**
         * ボタン情報セット
         * @param {*} areaName 
         */
        #setButton(areaName) {
            const area = document.querySelector('#' + areaName + ' .button_area')
            while (area.firstChild) {
                area.removeChild(area.firstChild)
            }

            for (const value of this.#data['disp'][areaName]) {
                const button = document.createElement('button')
                let selected = Array.isArray(this.#selected[areaName]) ? this.#selected[areaName].includes(value) : (this.#selected[areaName] == value)
                button.className = 'button' + (selected ? ' button_selected' : '')
                button.value = value
                button.innerHTML = value
                area.appendChild(button)
            }
        }

        /**
         * 検索項目の絞り込み
         */
        narrowDown() {
            this.#data['disp']['r'] = this.#narrowDownR()
            this.#data['disp']['pc'] = this.#narrowDownPc()
            this.#data['disp']['j'] = this.#narrowDownJ()
            this.#data['disp']['i'] = this.#narrowDownI()
            for (const areaName in this.#data['disp']) {
                this.#setButton(areaName)
            }
        }

        /**
         * 検索項目絞り込み(R)
         * @returns 
         */
        #narrowDownR() {

            // PCとJとIがすべて未選択の場合は、baseをそのまま返す
            if (!this.#selected['pc'].length && !this.#selected['j'].length && !this.#selected['i'].length) {
                return this.#data['base']['r']
            }

            const rByPc = []
            const rByJ = []
            const rByI = []
            for (const r in this.#json) {
                for (const pc in this.#json[r]) {

                    // pcが未選択か選択しているpcとループのpcが同じならそのrを格納
                    const isAddPc = !this.#selected['pc'].length || (this.#selected['pc'].length && this.#selected['pc'] == pc)
                    if (!rByPc.includes(r) && isAddPc) {
                        rByPc.push(r)
                    }

                    for (const j in this.#json[r][pc]) {
                        
                        // jが未選択か選択しているjとループのjが同じならそのrを格納
                        const isAddJ = !this.#selected['j'].length || (this.#selected['j'].length && this.#selected['j'] == j)
                        if (!rByJ.includes(r) && isAddPc & isAddJ) {
                            rByJ.push(r)
                        }

                        if (!rByI.includes(r) && isAddPc && isAddJ) {
                            let isAddI = true
                            if (this.#selected['i'].length) {
                                // Iが選択されている場合は、選択されたIが属するJにすべて含まれる場合に対象とする
                                const values = Object.values(this.#json[r][pc][j])
                                const duplicate = [...new Set([...this.#selected['i'], ...values])].filter((item) => {
                                    return this.#selected['i'].includes(item) && values.includes(item)
                                }).sort(this.#simpleSort)
                                isAddI = JSON.stringify(duplicate) == JSON.stringify(this.#selected['i'])
                            }
                            if (isAddI) {
                                rByI.push(r)
                            }
                        }
                    }
                }
            }

            // 各項目で絞り込んだもののうち、すべてその値が含まれているものだけ対象とする
            return [...new Set([...rByPc, ...rByJ, ...rByI])].filter((item) => {
                return rByPc.includes(item) && rByJ.includes(item) && rByI.includes(item)
            }).sort(this.#simpleSort)
        }

        /**
         * 検索項目絞り込み(PC)
         * @returns 
         */
        #narrowDownPc () {

            // RとJとIがすべて未選択の場合は、baseをそのまま返す
            if (!this.#selected['r'].length && !this.#selected['j'].length && !this.#selected['i'].length) {
                return this.#data['base']['pc']
            }

            const pcByR = []
            const pcByJ = []
            const pcByI = []
            for (const r in this.#json) {
                for (const pc in this.#json[r]) {

                    // rが未選択か選択しているrとループのrが同じならそのpcを格納
                    const isAddR = !this.#selected['r'].length || (this.#selected['r'].length && this.#selected['r'] == r)
                    if (!pcByR.includes(pc) && isAddR) {
                        pcByR.push(pc)
                    }

                    for (const j in this.#json[r][pc]) {
                        
                        // jが未選択か選択しているjとループのjが同じならそのpcを格納
                        const isAddJ = !this.#selected['j'].length || (this.#selected['j'].length && this.#selected['j'] == j)
                        if (!pcByJ.includes(pc) && isAddR && isAddJ) {
                            pcByJ.push(pc)
                        }

                        if (!pcByI.includes(pc) && isAddR && isAddJ) {
                            let isAddI = true
                            if (this.#selected['i'].length) {
                                // Iが選択されている場合は、選択されたIが属するJにすべて含まれる場合に対象とする
                                const values = Object.values(this.#json[r][pc][j])
                                const duplicate = [...new Set([...this.#selected['i'], ...values])].filter((item) => {
                                    return this.#selected['i'].includes(item) && values.includes(item)
                                }).sort(this.#simpleSort)
                                isAddI = JSON.stringify(duplicate) == JSON.stringify(this.#selected['i'])
                            }
                            if (isAddI) {
                                pcByI.push(pc)
                            }
                        }
                    }
                }
            }

            // 各項目で絞り込んだもののうち、すべてその値が含まれているものだけ対象とする
            return [...new Set([...pcByR, ...pcByJ, ...pcByI])].filter((item) => {
                return pcByR.includes(item) && pcByJ.includes(item) && pcByI.includes(item)
            }).sort(this.#pcSort)
        }

        /**
         * 検索項目絞り込み(J)
         * @returns 
         */
        #narrowDownJ () {

            // RとPCとIがすべて未選択の場合は、baseをそのまま返す
            if (!this.#selected['r'].length && !this.#selected['pc'].length && !this.#selected['i'].length) {
                return this.#data['base']['j']
            }

            const jByR = []
            const jByPc = []
            const jByI = []
            for (const r in this.#json) {
                for (const pc in this.#json[r]) {
                    for (const j in this.#json[r][pc]) {

                        // rが未選択か選択しているrとループのrが同じならそのjを格納
                        const isAddR = (!this.#selected['r'].length || (this.#selected['r'].length && this.#selected['r'] == r))
                        if (!jByR.includes(j) && isAddR) {
                            jByR.push(j)
                        }
                        
                        // pcが未選択か選択しているpcとループのpcが同じならそのjを格納
                        const isAddPc = !this.#selected['pc'].length || (this.#selected['pc'].length && this.#selected['pc'] == pc)
                        if (!jByPc.includes(j) && isAddR && isAddPc) {
                            jByPc.push(j)
                        }

                        if (!jByI.includes(j) && isAddR && isAddPc) {
                            let isAddI = true
                            if (this.#selected['i'].length) {
                                // Iが選択されている場合は、選択されたIが属するJにすべて含まれる場合に対象とする
                                const values = Object.values(this.#json[r][pc][j])
                                const duplicate = [...new Set([...this.#selected['i'], ...values])].filter((item) => {
                                    return this.#selected['i'].includes(item) && values.includes(item)
                                }).sort(this.#simpleSort)
                                isAddI = JSON.stringify(duplicate) == JSON.stringify(this.#selected['i'])
                            }
                            if (isAddI) {
                                jByI.push(j)
                            }
                        }
                    }
                }
            }

            return [...new Set([...jByR, ...jByPc, ...jByI])].filter((item) => {
                return jByR.includes(item) && jByPc.includes(item) && jByI.includes(item)
            }).sort(this.#simpleSort)
        }

        /**
         * 検索項目絞り込み(I)
         * @returns 
         */
        #narrowDownI() {

            // RとPCとJとIがすべて未選択の場合は、baseをそのまま返す
            if (!this.#selected['r'].length && !this.#selected['pc'].length && !this.#selected['j'].length && !this.#selected['i'].length) {
                return this.#data['base']['i']['single']
            }

            const selectableI = []
            for (const r in this.#json) {
                // Rを対象とする条件
                const isAddR = !this.#selected['r'].length || (this.#selected['r'].length && this.#selected['r'] == r)
                for (const pc in this.#json[r]) {
                    // PCを対象とする条件
                    const isAddPc = !this.#selected['pc'].length || (this.#selected['pc'].length && this.#selected['pc'] == pc)
                    for (const j in this.#json[r][pc]) {
                        // Jを対象とする条件
                        const isAddJ = !this.#selected['j'].length || (this.#selected['j'].length && this.#selected['j'] == j)
                        
                        if (isAddR && isAddPc && isAddJ) {
                            // R、PC、Jが対象の場合に、Iを絞り込む
                            let isSelectable = true
                            const values = Object.values(this.#json[r][pc][j])
                            if (this.#selected['i'].length) {
                                // Iが選択された場合は、選択されたIが含まれる場合に対象とする
                                const duplicate = [...new Set([...this.#selected['i'], ...values])].filter((item) => {
                                    return this.#selected['i'].includes(item) &&  values.includes(item)
                                }).sort(this.#simpleSort)
                                isSelectable = JSON.stringify(duplicate) == JSON.stringify(this.#selected['i'])
                            }
                            if (isSelectable) {
                                for (const value of values) {
                                    if (!selectableI.includes(value)) {
                                        selectableI.push(value)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return selectableI.sort(this.#simpleSort)
        }

        /**
         * テスト
         */
        test() {
            const backup = JSON.parse(JSON.stringify(this.#selected))
            let limit = 0
            this.#data['base']['i']['multi'].forEach((value) => {
                if (limit < value.length) {
                    limit = value.length
                }
            })

            let csv = "R(選択値),PC(選択値),J(選択値),I(選択値),R(選択可能値),PC(選択可能値),J(選択可能値),I(選択可能値)\r\n"
            for (const i of [[], ...this.#getCombinationAll(this.#data['base']['i']['single'], limit)]) {
                for (const j of ['', ...this.#data['base']['j']]) {
                    for (const pc of ['', ...this.#data['base']['pc']]) {
                        for (const r of ['', ...this.#data['base']['r']]) {
                            if (r == '' && pc == '' && j == '' && !i.length) {
                                continue
                            }
                            this.#selected['r'] = r
                            this.#selected['pc'] = pc
                            this.#selected['j'] = j
                            this.#selected['i'] = i
                            const dispR = this.#narrowDownR()
                            const dispPC = this.#narrowDownPc()
                            const dispJ = this.#narrowDownJ()
                            const dispI = this.#narrowDownI()
                            if (dispR.length && dispPC.length && dispJ.length && dispI.length) {
                                csv += '"' + (r.length ? r : '(なし)') + '"'
                                csv += ','
                                csv += '"' + (pc.length ? pc : '(なし)') + '"'
                                csv += ','
                                csv += '"' + (j.length ? j : '(なし)') + '"'
                                csv += ','
                                csv += '"' + (i.length ? i.join(',') : '(なし)') + '"'
                                csv += ','
                                csv += '"' + dispR.join(',') + '"'
                                csv += ','
                                csv += '"' + dispPC.join(',') + '"'
                                csv += ','
                                csv += '"' + dispJ.join(',') + '"'
                                csv += ','
                                csv += '"' + dispI.join(',') + '"'
                                csv += "\r\n"
                            }
                        }
                    }
                }
            }

            this.#selected = backup
            const url = URL.createObjectURL(new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], {type: 'text/csv'}))
            const option = {
                year: 'numeric',
                month: '2-digit',
                day:  '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }
            const filename = 'narrow_down_test-' + new Date().toLocaleDateString('ja-JP', option).replaceAll('/', '').replaceAll(':', '').replaceAll(' ', '') + '.csv'
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            a.click()
        }

        /**
         * コンビネーション(全体)取得
         */
        #getCombinationAll(arr, limit = -1) {
            let combinationAll = []
            for (let i = 0; i < arr.length; i++) {
                if (i + 1 > limit) {
                    break
                }
                combinationAll = [...combinationAll, ...this.#getCombination(arr, i + 1)]
            }

            return combinationAll
        }

        /**
         * コンビネーション(一部)取得
         * @param {*} arr 
         * @param {*} count 
         * @returns 
         */
        #getCombination(arr, count) {

            const combinations = []

            if (arr.length < count) {
                return []
            }
            if (count === 1) {
                arr.forEach((item) => {
                    combinations.push([item])
                })
            } else {
                for (let i = 0; i < arr.length - count + 1; i++) {
                    const recursion = this.#getCombination(arr.slice(i + 1), count - 1).sort(this.#iSort)
                    for (const recursionItem of recursion) {
                        const addItem = [arr[i], ...recursionItem].sort(this.#simpleSort)
                        const isAdd = this.#data['base']['i']['multi'].some((multiItem) => {
                            const duplicate = [...new Set([...addItem, ...multiItem])].filter((item) => {
                                return addItem.includes(item) && multiItem.includes(item)
                            }).sort(this.#simpleSort)
                            return JSON.stringify(duplicate) == JSON.stringify(addItem)
                        })
                        if (isAdd) {
                            combinations.push(addItem)
                        }
                    }
                }
            }
                
            return combinations
        } 

    }

    const goods = new Goods(json)
    const setEvent = (type, event, isAdd = true) => {
        return new Promise((resolve, reject) => {
            for (const b of document.querySelectorAll('button')) {
                if (isAdd) {
                    b.addEventListener(type, event)
                } else {
                    b.removeEventListener(type, event)
                }
            }
            resolve()
        })
    }

    const clickEvent = async (e) => {
        await setEvent('click', clickEvent, false)
        const prefix = (e.target.value.substring(0, 1).toLowerCase() == 'p' ? 'pc' : e.target.value.substring(0, 1).toLowerCase())
        const isActive = e.target.className.includes('button_selected')
        if (prefix == 'i') {
            goods.setSelected({'areaName': prefix, 'value': e.target.value})
        } else {
            goods.setSelected({'areaName': prefix, 'value': isActive ? '' : e.target.value})
        }
        await setEvent('click', clickEvent)
    }

    setEvent('click', clickEvent)

    const btnTest = document.getElementById('btnTest')
    if (btnTest) {
        const testEvent = (e) => {
            btnTest.removeEventListener('click', testEvent)
            goods.test()
            btnTest.addEventListener('click', testEvent)
        }
        btnTest.addEventListener('click', testEvent)
    }
})
