window.addEventListener("load", () => {
    /**
     * ソートの結果を表示する要素
     * @type {HTMLDivElement}
     */
    let sortBox = document.getElementById("sortBox");

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
        }

        /**@type {HTMLDivElement} */
        let content = sortBox.firstChild.firstChild;

        /**@type {!number} */
        let numOfElements = Math.min(Math.max(10, Number(envSetting.numOfElements.value)), 50);

        if(content.childElementCount > numOfElements){
            //要素を削除
            while(content.childElementCount > numOfElements){
                content.lastChild.remove();
            }
        }
        else{
            //要素の追加
            while(content.childElementCount < numOfElements){
                let newElement = document.createElement("div");
                newElement.dataset["index"] = content.childElementCount;

                content.appendChild(newElement);
            }
        }

        setElementRandomly();

        let width = content.clientWidth / numOfElements;
        [...content.children].forEach(element => {
            element.style.width = String(width) + "px";
        });

        return;
    }
    setEnv(); //読み込み時にも一回実行

    /**要素をランダムに入れ替える */
    function setElementRandomly(){
        /**@type {HTMLCollection} */
        let elements = sortBox.firstChild.firstChild.children;
        /**@type {!number} */
        let numOfChild = sortBox.firstChild.firstChild.childElementCount;

        //ランダムに入れ替える
        for(let i = 0; i < numOfChild; i++){
            let index = [Math.floor(Math.random() * numOfChild), Math.floor(Math.random() * numOfChild)];
            
            
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
    sortSetting.querySelector("[name='run']").addEventListener("click", event => {
        /**@type {HTMLInputElement} */
        let sortType = sortSetting.sortType.value;
        
        switch(sortType){
            case("bubble"): //バブルソート
                break;
            case("shaker"): //シェーカーソート
                break;
        }
    });
});