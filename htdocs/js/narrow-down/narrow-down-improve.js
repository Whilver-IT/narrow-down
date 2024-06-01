'use strict'

;const jsonData = `
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

document.addEventListener('DOMContentLoaded', dcl => {

    // ソート
    const simpleSort = (value1, value2) => {
        return value1.substring(1) - value2.substring(1)
    }
    const pcSort = (value1, value2) => {
        const pc1 = value1.split('|')
        const pc2 = value2.split('|')
        const p1 = pc1[0].substring(1)
        const p2 = pc2[0].substring(1)
        if (p1 > p2) {
            return 1
        }
        if (p1 < p2) {
            return -1
        }
        const c1 = pc1[1].substring(1)
        const c2 = pc2[1].substring(1)
        if (c1 > c2) {
            return 1
        }
        if (c1 < c2) {
            return -1
        }
        return 0
    }
    const iSort = (value1, value2) => {
        if (value1.length > value2.length) {
            return 1
        }
        if (value1.length < value2.length) {
            return -1
        }
        for (let i = 0; i < value1.length; i++) {
            const i1 = value1[i].substring(1)
            const i2 = value2[i].substring(1)
            if (i1 > i2) {
                return 1
            }
            if (i1 < i2) {
                return -1
            }
        }
        return 0
    }

    // 元のJSONをSQLと同じような形式へ
    const json = JSON.parse(jsonData)

    // 検索要素格納用変数
    const searchList = {
        'r': [],
        'pc': [],
        'j': [],
        'i': {
            'single': [],
            'multi': [],
        }
    }

    // SQLと同じ形式格納用変数
    const data = {}

    // 変数に各値を格納
    let limit = 1
    for (const r in json) {
        for (const pc in json[r]) {
            for (const j in json[r][pc]) {
                if (typeof data[r] == 'undefined') {
                    data[r] = {}
                }
                if (typeof data[r][pc] == 'undefined') {
                    data[r][pc] = {}
                }
                if (typeof data[r][pc][j] == 'undefined') {
                    data[r][pc][j] = []
                }
                data[r][pc][j] = Object.values(json[r][pc][j]).sort(simpleSort)

                // 配列数取得
                const length = data[r][pc][j].length

                // 配列数の方が大きい場合は配列数を格納
                limit = length > limit ? length : limit

                // 以下検索用変数に格納
                if (!searchList['r'].includes(r)) {
                    searchList['r'].push(r)
                }
                if (!searchList['pc'].includes(pc)) {
                    searchList['pc'].push(pc)
                }
                if (!searchList['j'].includes(j)) {
                    searchList['j'].push(j)
                }
                if (!searchList['i']['multi'].some(item => JSON.stringify(item) == JSON.stringify(data[r][pc][j]))) {
                    searchList['i']['multi'].push(data[r][pc][j])
                }
                for (const i of data[r][pc][j]) {
                    if (!searchList['i']['single'].includes(i)) {
                        searchList['i']['single'].push(i)
                    }
                }
            }
        }
    }

    // 検索要素をソート
    for (const key of Object.keys(searchList)) {
        switch (key) {
            case 'pc':
                searchList[key].sort(pcSort)
                break
            case 'i':
                searchList[key]['single'].sort(simpleSort)
                break
            default:
                searchList[key].sort(simpleSort)
                break
        }
    }

    // コンビネーション
    const getCombinationAll = (arr, limit) => {
        let combinations = []
        for (let i = 0; i < arr.length; i++) {
            if (i + 1 > limit) {
                break
            }
            combinations = [...combinations, ...getCombination(arr, i + 1)]
        }
        return combinations
    }
    const getCombination = (arr, count) => {
        const combination = []
        if (arr.length < count) {
            return []
        }
        if (count == 1) {
            arr.forEach(value => {
                combination.push([value])
            })
        } else {
            for (let i = 0; i < arr.length; i++) {
                const recursion = getCombination(arr.slice(i + 1), count - 1).sort(iSort)
                for (const recursionItem of recursion) {
                    const addItem = [arr[i], ...recursionItem].sort(simpleSort)
                    const isAdd = searchList['i']['multi'].some(multiItem => {
                        const duplicate = [...new Set([...addItem, ...multiItem])].filter(item => {
                            return addItem.includes(item) && multiItem.includes(item)
                        }).sort(simpleSort)
                        return JSON.stringify(duplicate) == JSON.stringify(addItem)
                    })
                    if (isAdd) {
                        combination.push(addItem)
                    }
                }
            }
        }
        return combination
    }

    /**
     * 選択値から選択可能値を取得
     * @param {*} searched 
     * @returns 
     */
    const getSelectable = searched => {

        // 選択可能値を格納する変数
        const selectable = {
            'r': [],
            'pc': [],
            'j': [],
            'i': [],
        }

        for (const r in data) {
            for (const pc in data[r]) {
                for (const j in data[r][pc]) {

                    // ループ中のRと選択したRが等しいとする条件(未選択はすべて選択とみなす。Rの選択可能値を対象とする条件ではないので注意：以降PC、J、Iも同様)
                    const isTargetR = !searched['r'].length || searched['r'] == r

                    // PCを対象とする条件
                    const isTargetPc = !searched['pc'].length || searched['pc'] == pc

                    // Jを対象とする条件
                    const isTargetJ = !searched['j'].length || searched['j'] == j

                    // Iを対象とする条件
                    let isTargetI = true
                    if (searched['i'].length) {
                        const duplicate = [...new Set([...searched['i'], ...data[r][pc][j]])].filter(item => {
                            return searched['i'].includes(item) && data[r][pc][j].includes(item)
                        }).sort(simpleSort)
                        isTargetI = JSON.stringify(duplicate) == JSON.stringify(searched['i'])
                    }

                    // 選択可能値R
                    if (!selectable['r'].includes(r) && isTargetPc && isTargetJ && isTargetI) {
                        selectable['r'].push(r)
                    }

                    // 選択可能値PC
                    if (!selectable['pc'].includes(pc) && isTargetR && isTargetJ && isTargetI) {
                        selectable['pc'].push(pc)
                    }

                    // 選択可能値J
                    if (!selectable['j'].includes(j) && isTargetR && isTargetPc && isTargetI) {
                        selectable['j'].push(j)
                    }

                    // 選択可能値I(Iは自分も絞り込まれるためisTargetIの値も確認する)
                    if (isTargetR && isTargetPc && isTargetJ && isTargetI) {
                        for (const i of data[r][pc][j]) {
                            if (!selectable['i'].includes(i)) {
                                selectable['i'].push(i)
                            }
                        }
                    }
                }
            }
        }
        for (const key of Object.keys(selectable)) {
            selectable[key].sort(key == 'pc' ? pcSort : simpleSort)
        }
        return selectable
    }

    // Iのコンビネーション値を取得
    const iList = getCombinationAll(searchList['i']['single'], limit)

    // 先頭に空を挿入
    searchList['r'].unshift('')
    searchList['pc'].unshift('')
    searchList['j'].unshift('')
    iList.unshift([])

    //console.log(getSelectable({r: '', pc: '', j:'', i: ['I04', 'I11']}))

    const test = document.getElementById('test')
    const clickTest = e => {
        test.removeEventListener('click', clickTest)
        let csv = "R(選択値),PC(選択値),J(選択値),I(選択値),R(選択可能値),PC(選択可能値),J(選択可能値),I(選択可能値)\r\n"
        for (const i of iList) {
            for (const j of searchList['j']) {
                for (const pc of searchList['pc']) {
                    for (const r of searchList['r']) {
                        if (!r.length && !pc.length && !j.length && !i.length) {
                            continue
                        }
                        const selectable = getSelectable({'r': r, 'pc': pc, 'j': j, 'i': i})
                        if (selectable['r'].length && selectable['pc'].length && selectable['j'].length && selectable['i'].length) {
                            csv += '"' + (r.length ? r : '(なし)') + '"'
                            csv += ','
                            csv += '"' + (pc.length ? pc : '(なし)') + '"'
                            csv += ','
                            csv += '"' + (j.length ? j : '(なし)') + '"'
                            csv += ','
                            csv += '"' + (i.length ? i.join(',') : '(なし)') + '"'
                            csv += ','
                            csv += '"' + selectable['r'].join(',') + '"'
                            csv += ','
                            csv += '"' + selectable['pc'].join(',') + '"'
                            csv += ','
                            csv += '"' + selectable['j'].join(',') + '"'
                            csv += ','
                            csv += '"' + selectable['i'].join(',') + '"'
                            csv += "\r\n"
                        }
                    }
                }
            }
        }

        const url = URL.createObjectURL(new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], {type: 'text/csv'}))
        const option = {
            year: 'numeric',
            month: '2-digit',
            day:  '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }
        const filename = 'narrow_down_improve-' + new Date().toLocaleDateString('ja-JP', option).replaceAll('/', '').replaceAll(':', '').replaceAll(' ', '') + '.csv'
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        test.addEventListener('click', clickTest)
    }

    test.addEventListener('click', clickTest)
})