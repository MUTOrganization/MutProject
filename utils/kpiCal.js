import lodash from 'lodash'
export function kpiPercentCal(e){
    let target = {...e}
    const _value = +target.value;
        let _totalProgress = lodash.sumBy(target.dataEntries, e => +e.value);
        let _month =  12;
        let _percent;
        if(target.targetPeriod === 'monthly'){
            _month = +target.endMonth - +target.startMonth + 1
            if(target.targetType === 'มากกว่า'){
                _percent = _totalProgress / (_value * _month) * 100
            }else if(target.targetType === 'น้อยกว่า'){
                _percent = (((_value * _month) - _totalProgress) / (_value * _month)) * 100
            }else{
                let totalPercent = 0;
                target.dataEntries.forEach(dataEn => {
                    if(+dataEn.value === _value){
                        totalPercent += 100;   
                    }
                })
                _percent = totalPercent / (_value * _month) * 100;
            }
        }else{
            if(target.targetType === 'มากกว่า'){
                _percent = _totalProgress / _value * 100
            }else if(target.targetType === 'น้อยกว่า'){
                _percent = (_value - _totalProgress) / _value * 100
            }else{
                _percent = _totalProgress === _value ? 100 : 0;
            }
        }
        if(_value === 0){
            if(target.targetType === 'มากกว่า') _percent = 100;
            else _percent = _totalProgress < 1 ? 100 : 0
        }
        _percent = +target.weight == 0 ? 0 : (_percent * +target.weight / 100)
        target.value = _value;
        target.weight = +target.weight;
        target.progress = _totalProgress
        target.percent = _percent;
        target.progressMonth = _month;
        target.collectValue = _value * _month;
    return target;
}