// Review funnel: 4-5 stars -> Google review; 1-3 stars -> private feedback
(function () {
  var stars = document.querySelectorAll('.rate-stars button');
  var result = document.getElementById('funnelResult');
  var GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=REPLACE_WITH_PLACE_ID'; // placeholder

  function paint(n) {
    stars.forEach(function (s, idx) { s.classList.toggle('lit', idx < n); });
  }

  stars.forEach(function (star) {
    var val = parseInt(star.dataset.val, 10);
    star.addEventListener('mouseenter', function () { paint(val); });
    star.addEventListener('focus', function () { paint(val); });
    star.addEventListener('click', function () {
      paint(val);
      if (val >= 4) {
        result.innerHTML =
          '<div class="card-soft" style="text-align:center">' +
          '<h3>Thank you — that means a lot.</h3>' +
          '<p>Would you mind sharing it on Google? It helps other Canterbury locals find us.</p>' +
          '<a class="btn btn-primary" style="justify-content:center" href="' + GOOGLE_REVIEW_URL + '" target="_blank" rel="noopener">Leave a Google review</a>' +
          '</div>';
      } else {
        result.innerHTML =
          '<div class="card-soft">' +
          '<h3>Thanks for the honest feedback.</h3>' +
          '<p>We’d genuinely like to put it right. Tell us what happened and John will be in touch.</p>' +
          '<form action="https://formsubmit.co/contact@eastcoastelectrical.co.nz" method="POST">' +
          '<input type="hidden" name="_subject" value="Private feedback — East Coast Electrical">' +
          '<input type="hidden" name="_captcha" value="false">' +
          '<input type="hidden" name="rating" value="' + val + ' star">' +
          '<div class="field"><label>Your name</label><input type="text" name="name" required></div>' +
          '<div class="field"><label>Phone or email</label><input type="text" name="contact" required></div>' +
          '<div class="field"><label>What can we do better?</label><textarea name="message" required></textarea></div>' +
          '<button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Send privately</button>' +
          '</form></div>';
      }
      result.classList.add('show');
    });
  });

  var wrap = document.querySelector('.rate-stars');
  if (wrap) wrap.addEventListener('mouseleave', function () {
    var lit = document.querySelectorAll('.rate-stars button.lit').length;
    paint(lit);
  });
})();
