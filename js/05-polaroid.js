  /* ================= Polaroid photo/video slots ================= */
  document.querySelectorAll('.polaroid-photo img, .polaroid-photo video').forEach(function(media){
    media.addEventListener('error', function(){
      media.closest('.polaroid').classList.add('no-photo');
    });
  });
