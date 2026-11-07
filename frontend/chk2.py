p = "src/pages/GroupExpenses.jsx"
d = open(p, "rb").read()
print("remaining mojibake:", d.count(b"\xc3\xa2"))
