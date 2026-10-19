(function () {
  var form = document.getElementById("consult-form");
  var navCheck = document.getElementById("nav-check");
  var CONTACT = {
    companyName: "美诺微",
    companyLegal: "",
    email: "",
    phone: "",
    wechatQr: "",
    address: "",
    creditCode: "",
    icp: "",
    emailPending: true
  };
  var configNode = document.getElementById("minova-contact");
  if (configNode) {
    try {
      var parsed = JSON.parse(configNode.textContent);
      Object.keys(CONTACT).forEach(function (key) {
        if (parsed[key] == null) return;
        CONTACT[key] = key === "emailPending" ? Boolean(parsed[key]) : String(parsed[key]).trim();
      });
    } catch (error) {
      /* 配置不是合法 JSON 时，页面保留占位文案 */
    }
  }
  var EMAIL = CONTACT.email;

  function pending(label) {
    return " <span class=\"tag-pending\">" + label + "</span>";
  }

  function fillContact() {
    document.querySelectorAll("[data-contact=email]").forEach(function (node) {
      if (!EMAIL) {
        node.textContent = "邮箱待替换";
        node.removeAttribute("href");
        return;
      }
      node.textContent = EMAIL;
      node.setAttribute("href", "mailto:" + EMAIL);
    });
    document.querySelectorAll("[data-contact=email-note]").forEach(function (node) {
      node.hidden = !CONTACT.emailPending;
    });
    document.querySelectorAll("[data-contact=phone]").forEach(function (node) {
      if (!CONTACT.phone) {
        node.innerHTML = "电话尚未提供" + pending("待补充");
        return;
      }
      node.innerHTML = "<a href=\"tel:" + CONTACT.phone.replace(/\s/g, "") + "\">" + CONTACT.phone + "</a>";
    });
    document.querySelectorAll("[data-contact=address]").forEach(function (node) {
      node.innerHTML = CONTACT.address
        ? CONTACT.address
        : "地址尚未提供" + pending("待补充");
    });
    document.querySelectorAll("[data-contact=legal]").forEach(function (node) {
      var parts = [];
      parts.push(CONTACT.companyLegal || "公司主体");
      parts.push(CONTACT.creditCode || "统一社会信用代码");
      parts.push(CONTACT.address || "地址");
      parts.push(CONTACT.icp || "备案号");
      var complete = CONTACT.companyLegal && CONTACT.creditCode && CONTACT.address && CONTACT.icp;
      node.innerHTML = parts.join(" · ") + (complete ? "" : pending("待补充"));
    });
    document.querySelectorAll("[data-contact=company]").forEach(function (node) {
      if (CONTACT.companyName) node.textContent = CONTACT.companyName;
    });
    document.querySelectorAll("[data-contact=qr-note]").forEach(function (node) {
      node.innerHTML = CONTACT.wechatQr
        ? "微信二维码见本页咨询区"
        : "微信二维码" + pending("待替换");
    });
    document.querySelectorAll("[data-contact=qr]").forEach(function (node) {
      if (!CONTACT.wechatQr) {
        node.innerHTML = "<span>微信二维码<br>待替换</span>";
        node.setAttribute("aria-label", "微信二维码待替换");
        return;
      }
      node.innerHTML = "<img src=\"" + CONTACT.wechatQr + "\" alt=\"美诺微微信二维码\" width=\"132\" height=\"132\">";
      node.setAttribute("aria-label", "美诺微微信二维码");
    });
    if (form && EMAIL) form.setAttribute("action", "mailto:" + EMAIL);
  }

  fillContact();

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
      "美诺微咨询" + (CONTACT.emailPending || !EMAIL ? "（邮箱待替换）" : ""),
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
