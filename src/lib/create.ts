enum timerType {
    interval,
    timeout
}

/**
 * id: timer's id
 * time: timer's time
 * callback: timer's callback function
 * comment: mark this timer to filter or location
 * loop: is loop? interval must be false,
 * randomStamp: generate random string with random string and current time
 * createTime: timer's create time
 * loop: loop or not loop, loop
 * type: timerType
 */
type tagType = {
    id: number
    time: number
    comment: string
    callback: () => {}
    randomStamp: string
    createTime: number,
    loop: boolean
    type: timerType
}

/**
 * tag status , true: be active, false: be inactive, has finished
 * tag finished time
 */
type tagStatusType = {
    status: boolean
    finishTime: Array<number>
}

// generate 12 width string
function generateRandomString(l: string): string {
    return l.slice(-8) + Math.random().toString(36).slice(-4)
}

class TimerSubscript {
    // singleton
    private static _instance: TimerSubscript

    public static get Instance() {
        return this._instance ? this._instance : new this()
    }

    private constructor() { }

    private center: { [key: string]: tagType & tagStatusType } = {}

    createTag(obj: tagType) {
        this.center[obj.id] = { ...obj, status: true, finishTime: [] }
    }

    finishTag(mark: timerType, stamp: string, time: number) {
        const _randomStamp = stamp
        const _keys = Object.keys(this.center)

        for (let i = 0; i < _keys.length; i++) {
            const _l = this.center[_keys[i]]
            if (_l.randomStamp === _randomStamp) {
                _l.finishTime.push(time);
                switch (mark) {
                    case timerType.interval:
                        _l.status = true;
                        break;
                    case timerType.timeout:
                        _l.status = false;
                        break;
                    default:
                        break;
                }
                break;
            }
        }
    }

    /**
     * create interval timer
     * @param callback callback function
     * @param timer interval time
     * @param comment descriptions
     */
    interval(callback: () => {}, time: number, comment: string) {

        const _loop = true;

        const _t = new Date().getTime()
        const _randomTimestamp = generateRandomString(_t.toString())
        const tag: number = setInterval(() => {
            this.finishTag(timerType.interval, _randomTimestamp, new Date().getTime())
            callback()
        }, time)
        this.createTag({ id: tag, time, comment, callback, randomStamp: _randomTimestamp, createTime: _t, loop: _loop, type: timerType.interval })
    }

    /**
     * create timeout timer
     * @param callback function 
     * @param timer timeout time
     * @param comment description
     * @param loop default is false, if it be true, will call back again while finished
     */
    timeout(callback: () => {}, time: number, comment: string, loop?: boolean) {

        const _loop = loop || false;

        const _t = new Date().getTime()
        const _randomTimestamp = generateRandomString(_t.toString())
        const tag: number = setTimeout(() => {
            this.finishTag(timerType.timeout, _randomTimestamp, new Date().getTime())
            callback()
        }, time)

        this.createTag({ id: tag, time, comment, callback, randomStamp: _randomTimestamp, createTime: _t, loop: _loop, type: timerType.timeout })
    }

    checkCenter() {
        return this.center
    }

    /**
     * cancel task by comment, filter all comment equal target
     * 
     */
    cancelTask(comment: string) {
        const _keys = Object.keys(this.center)
        const _arr = []
        for (let i = 0; i < _keys.length; i++) {
            const _l = this.center[_keys[i]]
            console.log(123, _l)
            if (_l.status === true && _l.comment === comment) {
                _arr.push(_l)
            }
        }
        _arr.length && _arr.forEach(e => {
            switch (e.type) {
                case timerType.interval:
                    clearInterval(e.id)
                    break;
                case timerType.interval:
                    clearTimeout(e.id)
                    break;
                default:
                    break;
            }
        })
    }
}

export default TimerSubscript

