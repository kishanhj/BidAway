function countdowny(){
    if(daysy == 0 && hoursy == 0 && minutesy == 0 && secondsy == 0){
      //seconds = 0;
      timez.innerHTML = "Auction Ended";
      }
      else{
        if(secondsy == 0){
            secondsy = 59;
            minutesy--;
          }else{
          secondsy--;
          }
          if(minutesy == -1){
          minutesy = 59;
            hoursy--;
           }
           if(hoursy == -1){
             hoursy = 23;
             daysy--;
        }
        if(daysy == -1){
             daysy = 0;
        }
  
        timez.innerHTML = "<span class=''>"+daysy+"D</span><span class=''> "+hoursy+"H</span><span class=''> "+minutesy+"M</span><span class=''> "+secondsy+"S</span>";
        setTimeout(countdowny,1000);   
        }
    }