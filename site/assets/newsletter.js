// Newsletter signup and unsubscribe forms. The API lives at /api/* (Cloudflare Worker, see worker/newsletter.js).
(function(){
  var EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function wire(form, path, ok){
    if(!form)return;
    var t0=Date.now(), msg=form.querySelector('.nl-msg'), btn=form.querySelector('button[type=submit]'), input=form.querySelector('input[type=email]'), hp=form.querySelector('.hp');
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var email=input.value.trim();
      if(!EMAIL.test(email)){msg.textContent='Enter a valid email address.';input.focus();return;}
      btn.disabled=true; msg.textContent='Sending…';
      fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email,website:hp?hp.value:'',t:Date.now()-t0})})
        .then(function(r){return r.json().catch(function(){return {ok:false,error:'Signup opens soon. Please try again later.'}})})
        .then(function(d){
          if(d&&d.ok){msg.textContent=ok;form.reset();}
          else{msg.textContent=(d&&d.error)||'Something went wrong. Please try again later.';}
        })
        .catch(function(){msg.textContent='Something went wrong. Please try again later.';})
        .then(function(){btn.disabled=false;});
    });
  }
  wire(document.getElementById('nl-form'),'/api/subscribe',"Thanks. You're on the list.");
  wire(document.getElementById('un-form'),'/api/unsubscribe','Done. This address will not receive the newsletter anymore.');
})();
