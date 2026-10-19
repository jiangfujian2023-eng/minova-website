(function () {
  var form = document.getElementById("consult-form");
  var navCheck = document.getElementById("nav-check");
  var EMAIL = "placeholder@mnwei.com";

  document.querySelectorAll("#nav-menu a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (navCheck) navCheck.checked = false;
    });
  });

  document.querySelectorAll("[data-topic]").forEach(function (link) {
    link.addEventListener("click", function () {
      var topic = document.querySelector("#consult-form [name=topic]");
      if (topic) topic.value = link.getAttribute("data-topic") || "";
    });
  });

  if (!form) return;

  var panel = document.getElementById("consult-result");
  var output = document.getElementById("consult-output");
  var copyBtn = document.getElementById("copy-consult");
  var mailBtn = document.getElementById("mail-consult");

  function field(name) {
    var value = new FormData(form).get(name);
    return (value || "").toString().trim();
  }

  function compose() {
    return [
      "美诺微咨询（网站表单，邮箱待替换）",
      "姓名：" + field("name"),
      "联系方式：" + field("contact"),
      "阶段：" + field("stage"),
      "想了解：" + field("topic"),
      "补充：" + (field("message") || "（无）")
    ].join("\n");
  }

  function bindValidity(input, emptyMessage) {
    input.addEventListener("invalid", function () {
      input.setCustomValidity(input.validity.valueMissing ? emptyMessage : "");
    });
    input.addEventListener("input", function () {
      input.setCustomValidity("");
    });
  }

  bindValidity(form.querySelector("[name=name]"), "请留下怎么称呼你");
  bindValidity(form.querySelector("[name=contact]"), "请留下电话或微信，方便回复");
  bindValidity(form.querySelector("[name=stage]"), "请选择你目前的阶段");
  bindValidity(form.querySelector("[name=topic]"), "请选择想了解的内容");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    output.value = compose();
    panel.hidden = false;
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  copyBtn.addEventListener("click", function () {
    var text = output.value || compose();
    output.value = text;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        copyBtn.textContent = "已复制";
      }).catch(function () {
        output.focus();
        output.select();
        copyBtn.textContent = "请长按文本框复制";
      });
    } else {
      output.focus();
      output.select();
      copyBtn.textContent = "请长按文本框复制";
    }
    window.setTimeout(function () {
      copyBtn.textContent = "复制咨询内容";
    }, 2200);
  });

  mailBtn.addEventListener("click", function () {
    var text = output.value || compose();
    window.location.href = "mailto:" + EMAIL
      + "?subject=" + encodeURIComponent("美诺微咨询")
      + "&body=" + encodeURIComponent(text);
  });
})();
