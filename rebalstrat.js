const fs = require('fs');

fs.readFile('./data/daily_xau.json', 'utf8', (err, jsonString) => {
  if (err) throw err;
  const data = JSON.parse(jsonString);

//   upclosedownclose(data);
    rebalstrat(data);
  
});




function upclosedownclose(data){

    // NORMAL UPCLOSE AND DOWNCLOSE 
let upclose =0,downclose=0;
  data.forEach(element => {

    if(element.close>element.open){
        upclose++;
    }else{
        downclose++;
    }

});


console.log("Total weeks: ",data.length);
console.log("Up Weeks % : ",(upclose/data.length)*100);
console.log("Down Weeks % : ",(downclose/data.length)*100);

}


function rebalstrat(data){
    
    let formation={
        count:0,
        bullishcount:0,
        bearishcount:0,
    }
    
    
    let success = {
    count:0,
    date:[],
    PreviousWeekLowSweep:{
        count:0,
        date:[]
    },
    PreviousWeekHighSweep:{
        count:0,
        date:[]
    },
    ClosedWithinGap:{
        count:0,
        date:[]
    },
    ClosedGreaterThanGap:{
        count:0,
        date:[]
    },
    BullishConditions:{
        count:0,
        date:[]
    },
    BearishConditions:{
        count:0,
        date:[]
    }
}

let failure ={
    count:0,
    date:[],
    BullishConditions:{
        count:0,
        date:[]
    },
    BearishConditions:{
        count:0,
        date:[]
    }
}


    for(i=0;i<(data.length-2);i++){

        let currentWeek = data[i];
        let previousWeek=data[i+1];                      // We need OHLC value of 3 weeks to check the pattern
        let priorPreviousWeek=data[i+2];


        if( previousWeek.close < previousWeek.open ){                               //Bullish Conditions

            if ((priorPreviousWeek.low - previousWeek.close)>0){

                formation.count++;
                formation.bullishcount++;

                if(currentWeek.close>priorPreviousWeek.low || currentWeek.high>priorPreviousWeek.low){
                
                    success.count++;
                    success.date.push(currentWeek.date);
                    success.BullishConditions.count++;
                    success.BullishConditions.date.push(currentWeek.date);

                    if(currentWeek.low<previousWeek.low){
                        success.PreviousWeekLowSweep.count++;
                        success.PreviousWeekLowSweep.date.push(currentWeek);
                    }
                    if(currentWeek.close<priorPreviousWeek.low && currentWeek.close>previousWeek.close){
                        success.ClosedWithinGap.count++;
                        success.ClosedWithinGap.date.push(currentWeek.date)
                    }
                    if(currentWeek.close>priorPreviousWeek.low){
                        success.ClosedGreaterThanGap.count++;
                        success.ClosedGreaterThanGap.date.push(currentWeek.date);
                    }

                }
                else{
                    failure.count++;
                    failure.date.push(currentWeek.date);
                    
                }
            }
        }

        if(previousWeek.close>previousWeek.open){           //Bearish conditions

            if((previousWeek.close-priorPreviousWeek.high)>0){

                formation.count++;
                formation.bearishcount++;
                if(currentWeek.close<priorPreviousWeek.high || currentWeek.low<priorPreviousWeek.high){

                    success.count++;
                    success.date.push(currentWeek.date);
                    success.BearishConditions.count++;
                    success.BearishConditions.date.push(currentWeek.date);

                    if(currentWeek.high>previousWeek.high){
                        success.PreviousWeekHighSweep.count++;
                        success.PreviousWeekHighSweep.date.push(currentWeek.date)
                    }
                    if(currentWeek.close<previousWeek.close && currentWeek.close>priorPreviousWeek.high){
                        success.ClosedWithinGap.count++;
                        success.ClosedWithinGap.date.push(currentWeek.date)
                    }
                    if(currentWeek.close<priorPreviousWeek.high){
                        success.ClosedGreaterThanGap.count++;
                        success.ClosedGreaterThanGap.date.push(currentWeek.date)
                    }
                }
                else{
                        failure.count++;
                        failure.date.push(currentWeek.date);
                        
                    }
                }
        }
    }
    
    
    console.log("Formation Frequency:" ,formation.count , `in ${data.length} data set` )
    console.log("Bullish Formaton:", formation.bullishcount)
    console.log("Bearish Formation:",formation.bearishcount)
    console.log("Success count:" , success.count )
    console.log("Failure count:" , failure.count )
    console.log("successfull bullish cases :",success.BullishConditions.count)
    console.log("successfull bearish cases:",success.BearishConditions.count)
    console.log("Success in bullish formation:", (success.BullishConditions.count/formation.bullishcount)*100)
    console.log("success in bearish formation:",(success.BearishConditions.count/formation.bearishcount)*100)
    console.log("Previous week low sweep in bullish successfull conditions:", success.PreviousWeekLowSweep.count)
    console.log("Preious week high sweep in bearish successfull conditions:",success.PreviousWeekHighSweep.count)
    console.log("Close within gap when successfull:",success.ClosedWithinGap.count)
    console.log("Close complete gap and more when successfull:",success.ClosedGreaterThanGap.count)
    console.log(`Plays out ${(success.count/formation.count)*100}% of the time when it forms`)
    console.log(success.date)
}