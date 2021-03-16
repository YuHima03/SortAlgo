/**
 * SortAlgo.js
 * 
 * @author YuHima <Twitter:@YuHima_03>
 * @copyright (C)2021 YuHima
 * @version 1.0.0 (2021-03-16)
 */

class SortAlgo{
    /**
     * @param {Array} array 
     * @param {Boolean} desc 降順
     */
    constructor(array, desc = false){
        this.array = array;
        this.desc = desc;
    }

    /**
     * @param {Function} callback 
     */
    setFunction(callback){
        this.callback = callback;
    }

    Checker(){
        for(let i = 0; i < this.array.length - 1; i++){
            if(this.desc){
                if(this.array[i] < this.array[i+1]){
                    return false;
                }
            }
            else{
                if(this.array[i] > this.array[i+1]){
                    return false;
                }
            }
        }

        return true;
    }

    Bubble(){

    }
}