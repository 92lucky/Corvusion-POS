export function exportToCSV(
  filename: string,
  rows: Record<string, unknown>[]
) {
  if (rows.length === 0) {
    return
  }

  const headers = Object.keys(rows[0])

  const escapeCSV = (value: unknown) => {
    const text = String(value ?? "")

    return `"${text.replace(/"/g, '""')}"`
  }

  const csv = [
    headers.map(escapeCSV).join(";"),
    ...rows.map((row) =>
      headers
        .map((header) =>
          escapeCSV(row[header])
        )
        .join(";")
    ),
  ].join("\r\n")

  const blob = new Blob(
    ["\uFEFF" + csv],
    {
      type: "text/csv;charset=utf-8;",
    }
  )

  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}
