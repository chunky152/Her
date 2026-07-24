  /* ================= Polaroid photo/video slots ================= */
  document.querySelectorAll('.polaroid-photo img').forEach(function(img){
    img.addEventListener('error', function(){
      img.closest('.polaroid').classList.add('no-photo');
    });
  });
  document.querySelectorAll('.polaroid-photo video').forEach(function(video){
    video.addEventListener('error', function(){
      video.closest('.polaroid').classList.add('no-photo');
    });
  });
