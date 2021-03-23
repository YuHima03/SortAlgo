window.addEventListener("load", () => {
    /**@type {Array.<!number>} */
    let sortArrayData = [];

    /**
     * ソートの結果を表示する要素
     * @type {HTMLDivElement}
     */
    let sortBox = document.getElementById("sortBox");
    /**@type {HTMLDivElement} */
    let sortBoxContent = sortBox.firstChild.firstChild;

    /**
     * 環境設定のフォーム
     * @type {HTMLFormElement}
     */
    let envSetting = document.getElementById("envSetting");

    /**環境設定を適応 */
    function setEnv(){
        if(sortBox.classList.contains("err")){
            sortBox.classList.remove("err");
            removeAllChildElements(sortBox);

            let tmp = document.createElement("div");
            tmp.appendChild(document.createElement("div"));
            sortBox.appendChild(tmp);

            //sortBoxContentの参照を更新
            sortBoxContent = sortBox.firstChild.firstChild;
        }

        /**@type {!number} */
        let numOfElements = Math.min(Math.max(5, Number(envSetting.numOfElements.value)), 500);

        if(sortBoxContent.childElementCount > numOfElements){
            //要素を削除
            while(sortBoxContent.childElementCount > numOfElements){
                sortBoxContent.lastChild.remove();
            }
        }
        else{
            //要素の追加
            while(sortBoxContent.childElementCount < numOfElements){
                let newElement = document.createElement("div");
                newElement.dataset["index"] = sortBoxContent.childElementCount;

                sortBoxContent.appendChild(newElement);
            }
        }

        setElementRandomly();

        let width = sortBoxContent.clientWidth / numOfElements;
        let height = 100 / numOfElements;
        [...sortBoxContent.children].forEach(element => {
            //element.style.width = String(width) + "px";

            let heightPer = height * (Number(element.dataset["index"]) + 1);
            element.style.height = String(heightPer) + "%";
            element.style.marginTop = "calc(100% - " + String(heightPer) + "%)"
        });

        return;
    }
    setEnv(); //読み込み時にも一回実行

    /**要素をランダムに入れ替える */
    function setElementRandomly(){        
        let elements = sortBoxContent.children;

        /**@type {!number} */
        let numOfChild = sortBoxContent.childElementCount;

        ["select-blue", "select-gray", "select-red", "select-orange", "complete"].forEach(colStr => {
            [...sortBoxContent.getElementsByClassName(`${colStr}`)].forEach(element => {
                element.classList.remove(`${colStr}`);
            });
        });

        //ランダムに入れ替える
        for(let i = 0; i < numOfChild * 10; i++){
            let index = [Math.floor(Math.random() * numOfChild), Math.floor(Math.random() * numOfChild)];
            
            sortBoxContent.insertBefore(elements[index[0]], elements[index[1]]);
            sortBoxContent.insertBefore(elements[index[1]], elements[index[0]]);
        }
    }

    //「適応」ボタンを押したとき
    envSetting.querySelector("[name='set']").addEventListener("click", setEnv);

    /**
     * ソートの設定をするフォーム
     * @type {HTMLFormElement}
     */
    let sortSetting = document.getElementById("sortSetting");

    //「実行」ボタンを押したとき
    sortSetting.querySelector("[name='run']").addEventListener("click", async () => {
        /**@type {HTMLInputElement} */
        let sortType = sortSetting.sortType.value;

        let sortElementList = sortBoxContent.children;

        //遅延(ミリ秒)
        let waitMsec = Math.max(0, Math.min(Number(sortSetting.waitMsec.value), 100));

        let elementArray = [];
        [...sortElementList].forEach(element => {
            element.classList.remove("complete");
            elementArray.push(Number(element.dataset["index"]));
        });

        sortArrayData = [];
        elementArray.forEach(num => {
            sortArrayData.push(num);
        });

        /**
         * ```i```番目の要素を赤色に
         * @param {number} i 
         * @param {string} color
         */
        function setColor(i, color){
            [...sortElementList][i].classList.add(`select-${color}`);

            return;
        }
        /**
         * 色の解除
         * @param  {...string} color 
         */
        function unsetColor(...color){
            [...color].forEach(colStr => {
                [...sortBoxContent.getElementsByClassName(`select-${colStr}`)].forEach(element => {
                    element.classList.remove(`select-${colStr}`);
                });
            });

            return;
        }
        
        switch(sortType){
            case("bubble"):
                //バブルソート

                while(true){
                    let flag = true;

                    for(let i = 0; i + 1 < elementArray.length; i++){
                        //色を解除
                        unsetColor("red", "blue");

                        //選択中のやつを赤色に
                        setColor(i, "red");

                        if(elementArray[i] < elementArray[i+1]){
                            //入れ替え対象を青色に
                            setColor(i+1, "blue");

                            await wait(waitMsec);

                            unsetColor("blue");

                            //入れ替え
                            swapArrayValue(elementArray, i, i+1);

                            sortBoxContent.insertBefore([...sortElementList][i], [...sortElementList][i+1]);
                            sortBoxContent.insertBefore([...sortElementList][i+1], [...sortElementList][i]);
                            
                            flag = false;
                        }

                        await wait(waitMsec);
                    }

                    if(flag) break;
                }

                break;

            case("shaker"):
                //シェーカーソート

                var type = 0;
                while(true){
                    let flag = true;

                    if(type % 2 == 0){
                        for(let i = 0; i + 1 < elementArray.length; i++){
                            //色を解除
                            unsetColor("red", "blue");

                            //選択中のやつを赤色に
                            setColor(i, "red");

                            if(elementArray[i] < elementArray[i+1]){
                                //入れ替え対象を青色に
                                setColor(i+1, "blue");

                                await wait(waitMsec);

                                unsetColor("blue");

                                //入れ替え
                                swapArrayValue(elementArray, i, i+1);

                                sortBoxContent.insertBefore([...sortElementList][i], [...sortElementList][i+1]);
                                sortBoxContent.insertBefore([...sortElementList][i+1], [...sortElementList][i]);
                                
                                flag = false;
                            }

                            await wait(waitMsec);
                        }
                    }
                    else{
                        for(let i = elementArray.length - 1; i > 0; i--){
                            //逆順

                            //色を解除
                            unsetColor("red", "blue");

                            //選択中のやつを赤色に
                            setColor(i, "red");

                            if(elementArray[i-1] < elementArray[i]){
                                //入れ替え対象を青色に
                                setColor(i-1, "blue");

                                await wait(waitMsec);

                                unsetColor("blue");

                                //入れ替え
                                swapArrayValue(elementArray, i-1, i);

                                sortBoxContent.insertBefore([...sortElementList][i-1], [...sortElementList][i]);
                                sortBoxContent.insertBefore([...sortElementList][i], [...sortElementList][i-1]);
                                
                                flag = false;
                            }

                            await wait(waitMsec);
                        }
                    }

                    type++;
                    if(flag) break;
                }

                break;

            case("comb"):
                //コムソート

                /**間隔 */
                var h = Math.floor(elementArray.length / 1.3);

                while(true){
                    let flag = true;

                    for(let i = 0; i + h < elementArray.length; i++){
                        //色を解除
                        unsetColor("red", "blue", "orange");

                        //選択中のやつを赤色に
                        setColor(i, "red");
                        setColor(i+h, "blue");

                        if(elementArray[i] < elementArray[i+h]){
                            await wait(waitMsec);

                            unsetColor("red", "blue");
                            setColor(i+h, "red");
                            setColor(i, "blue");

                            //入れ替え
                            swapArrayValue(elementArray, i, i+h);
                            
                            sortBoxContent.insertBefore([...sortElementList][i], [...sortElementList][i+h]);
                            sortBoxContent.insertBefore([...sortElementList][i+h], [...sortElementList][i]);
                            
                            flag = false;
                        }

                        await wait(waitMsec);
                    }

                    if(flag && h === 1) break;

                    h = Math.max(1, Math.floor(h / 1.3));
                }

                break;

            case("insert_gnome"):
                //挿入ソート or ノームソート
                //厳密には違うが見た感じの処理内容に差がない

                let indexFlag = 0;
                while(true){
                    let reverseFlag = -1;
                    for(let i = indexFlag; i + 1 < elementArray.length; i++){
                        //色を解除
                        unsetColor("red");

                        //選択中のやつを赤色に
                        setColor(i, "red");

                        //逆順を見つけたらそこから戻っていく
                        if(elementArray[i] < elementArray[i+1]){
                            reverseFlag = i + 1;
                            break;
                        }

                        await wait(waitMsec);
                    }

                    if(reverseFlag > -1){
                        //戻っていく
                        for(let i = reverseFlag; i > 0; i--){
                            //色を解除
                            unsetColor("red");

                            //選択中のやつを赤色に
                            setColor(i, "red");

                            if(elementArray[i-1] < elementArray[i]){
                                //入れ替え
                                swapArrayValue(elementArray, i-1, i);

                                sortBoxContent.insertBefore([...sortElementList][i-1], [...sortElementList][i]);
                                sortBoxContent.insertBefore([...sortElementList][i], [...sortElementList][i-1]);
                            }
                            else{
                                indexFlag = i;
                                break;
                            }

                            await wait(waitMsec);
                        }
                    }
                    else{
                        //ソート完了
                        break;
                    }
                }

                break;

            case("selection"):
                //選択ソート

                for(let i = 0; i < elementArray.length; i++){
                    let max = i;

                    unsetColor("blue");
                    setColor(i, "blue");

                    for(let j = i; j < elementArray.length; j++){
                        unsetColor("red");
                        setColor(j, "red");

                        if(elementArray[j] > elementArray[max]){
                            max = j;

                            unsetColor("orange");
                            setColor(j, "orange");
                        }

                        await wait(waitMsec);
                    }

                    //入れ替え
                    if(i != max){
                        swapArrayValue(elementArray, i, max);

                        sortBoxContent.insertBefore([...sortElementList][i], [...sortElementList][max]);
                        sortBoxContent.insertBefore([...sortElementList][max], [...sortElementList][i]);
                    }

                    //決定済み部分は灰色に
                    setColor(i, "gray");
                }

                break;

            case("quick"):
                //クイックソート
                
                /**
                 * 
                 * @param {Array.<!number>} array 
                 * @param {!number} left pos
                 * @param {!number} right pos
                 */
                async function quickSort(left, right){
                    //だいたい真ん中の数をとる
                    let pivot = Math.floor((right + left) / 2);
                    let pivotValue = elementArray[pivot];

                    [...sortBoxContent.children].forEach((element, index) => {
                        if(!valueBetween(index, left, right, true)){
                            setColor(index, "gray");
                        }
                    });

                    //ピボットに着色
                    setColor(pivot, "orange");

                    //一時保存
                    let leftEnd = left;
                    let rightEnd = right;

                    while(true){
                        //ピボットより小さい値を左から探索
                        while(elementArray[left] > pivotValue){
                            setColor(left, "red");

                            await wait(waitMsec);

                            left++;

                            unsetColor("red");
                        }

                        setColor(left, "red");

                        //ピボットより大きい値を右から探索
                        while(elementArray[right] < pivotValue){
                            setColor(right, "blue");

                            await wait(waitMsec);

                            right--;

                            unsetColor("blue");
                        }

                        setColor(right, "blue");

                        //入れ替え
                        swapArrayValue(elementArray, left, right);

                        sortBoxContent.insertBefore([...sortElementList][left], [...sortElementList][right]);
                        sortBoxContent.insertBefore([...sortElementList][right], [...sortElementList][left]);

                        await wait(waitMsec);

                        if(left >= right){
                            break;
                        }
                    }

                    unsetColor("gray", "red", "blue", "orange");

                    //左右に分割
                    if(left > leftEnd + 1) await quickSort(leftEnd, left - 1);
                    if(right + 1 < rightEnd) await quickSort(right, rightEnd);

                    return;
                }

                await quickSort(0, elementArray.length - 1);

                break;

            case("comb_r"):
                

                break;
        }

        //完了
        [...sortElementList].forEach(element => {
            element.classList.add("complete");
            element.classList.remove("select-red", "select-blue", "select-gray");
        });
    });

    //リセットボタンを押したとき
    sortSetting.querySelector("[name='reset']").addEventListener("click", async () => {
        let sortElementList = sortBoxContent.children;

        if(sortArrayData.length === sortBoxContent.childElementCount){
            let nowData = [];
            [...sortElementList].forEach(element => {
                nowData.push(Number(element.dataset["index"]));
                element.classList.add("select-gray");
            });

            for(let index = 0; index < sortArrayData.length; index++){
                let value = sortArrayData[index];
                let targetIndex = nowData.lastIndexOf(value);

                swapArrayValue(nowData, index, targetIndex);
                
                //入れ替え
                sortBoxContent.insertBefore([...sortElementList][index], [...sortElementList][targetIndex]);
                sortBoxContent.insertBefore([...sortElementList][targetIndex], [...sortElementList][index]);
            
                [...sortElementList][index].classList.remove("select-gray");

                await wait(50);
            }

            [...sortElementList].forEach(element => {
                element.classList.remove("complete");
            });
        }
    });
});