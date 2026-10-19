(function () {
  var form = document.getElementById("consult-form");
  var navCheck = document.getElementById("nav-check");
  var CONTACT = {
    companyName: "美诺微",
    companyLegal: "",
    phone: "",
    phoneDisplay: "",
    testPrice: "",
    address: "",
    creditCode: "",
    icp: ""
  };
  var configNode = document.getElementById("minova-contact");
  if (configNode) {
    try {
      var parsed = JSON.parse(configNode.textContent);
      Object.keys(CONTACT).forEach(function (key) {
        if (parsed[key] == null) return;
        CONTACT[key] = String(parsed[key]).trim();
      });
    } catch (error) {
      /* 配置不是合法 JSON 时，页面保留已写好的文案 */
    }
  }
  var PHONE_DIGITS = CONTACT.phone.replace(/\D/g, "");

  function fillContact() {
    var phoneLabel = CONTACT.phoneDisplay || CONTACT.phone;
    document.querySelectorAll("[data-contact=phone]").forEach(function (node) {
      if (!PHONE_DIGITS) {
        node.textContent = "";
        return;
      }
      node.innerHTML = "咨询电话：<a href=\"tel:" + PHONE_DIGITS + "\">" + phoneLabel + "</a>";
    });
    document.querySelectorAll("[data-contact=tel]").forEach(function (node) {
      if (PHONE_DIGITS) node.setAttribute("href", "tel:" + PHONE_DIGITS);
    });
    document.querySelectorAll("[data-contact=legal]").forEach(function (node) {
      var parts = [];
      if (CONTACT.companyLegal) parts.push(CONTACT.companyLegal);
      if (CONTACT.creditCode) parts.push(CONTACT.creditCode);
      if (CONTACT.address) parts.push(CONTACT.address);
      if (CONTACT.icp) parts.push(CONTACT.icp);
      if (parts.length) node.textContent = parts.join(" · ");
    });
    document.querySelectorAll("[data-contact=company]").forEach(function (node) {
      if (CONTACT.companyName) node.textContent = CONTACT.companyName;
    });
    document.querySelectorAll("[data-contact=copyright]").forEach(function (node) {
      var name = CONTACT.companyLegal || CONTACT.companyName;
      if (!name) return;
      node.textContent = "©2026 " + name + " · mnwei.com · 本页为静态介绍，未接入在线交易与在线诊疗。";
    });
    document.querySelectorAll("[data-contact=price]").forEach(function (node) {
      if (!CONTACT.testPrice) {
        node.hidden = true;
        return;
      }
      node.hidden = false;
      node.innerHTML = "<b>肠道菌群检测 ¥" + CONTACT.testPrice + "</b><span>具体项目以咨询为准</span>";
    });
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

  function field(name) {
    var value = new FormData(form).get(name);
    return (value || "").toString().trim();
  }

  function compose() {
    return [
      "美诺微咨询",
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

})();
