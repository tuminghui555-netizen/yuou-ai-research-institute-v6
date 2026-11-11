'use strict';
document.querySelectorAll('.work-demo').forEach(demo=>{
  const steps=[...demo.querySelectorAll('.work-step')];
  function select(index){
    steps.forEach((step,i)=>{
      step.setAttribute('aria-pressed',String(i===index));
      demo.querySelector('#'+step.getAttribute('aria-controls')).hidden=i!==index;
    });
  }
  steps.forEach((step,index)=>{
    step.addEventListener('click',()=>select(index));
    step.addEventListener('keydown',event=>{
      let next=index;
      if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%steps.length;
      else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index+steps.length-1)%steps.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=steps.length-1;
      else return;
      event.preventDefault();select(next);steps[next].focus();
    });
  });
});
