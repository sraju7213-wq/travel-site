// One-off: switch error/asterisk text from `text-brass` to the darker `text-brass-ink`
// so it meets WCAG AA on the light surfaces these forms sit on.
const fs = require("fs");
const path = require("path");

const files = [
  "src/components/NewsletterSection.tsx",
  "src/components/EnquiryForm.tsx",
];

for (const rel of files) {
  const file = path.join(__dirname, "..", rel);
  const before = fs.readFileSync(file, "utf8");
  let t = before;
  t = t.replace(/text-\[0\.8rem\] font-display text-brass/g, "text-[0.8rem] font-display text-brass-ink");
  t = t.replace(/<span className="text-brass">\*<\/span>/g, '<span className="text-brass-ink">*</span>');
  if (t !== before) {
    fs.writeFileSync(file, t);
    console.log("updated", rel);
  } else {
    console.log("unchanged", rel);
  }
}
