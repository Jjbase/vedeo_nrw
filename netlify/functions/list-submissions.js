// netlify/functions/list-submissions.js
export async function handler() {
  const token = process.env.NETLIFY_TOKEN;
  const formId = process.env.FORM_ID;

  if (!token || !formId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing NETLIFY_TOKEN or FORM_ID environment variable" }),
    };
  }

  const url = `https://api.netlify.com/api/v1/forms/${formId}/submissions?per_page=100`;

  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) { return { statusCode: res.status, body: await res.text() }; }
    const data = await res.json();

    const simplified = data.map((s) => ({
      id: s.id,
      created_at: s.created_at,
      name: s.data?.name || "",
      email: s.data?.email || "",
      phone: s.data?.phone || "",
      city: s.data?.city || "",
      country: s.data?.country || "",
      role: s.data?.role || "",
      deo_from: s.data?.deo_from || "",
      deo_to: s.data?.deo_to || "",
      classes_attended: s.data?.classes_attended || "",
      subjects_taught: s.data?.subjects_taught || "",
      dept: s.data?.dept || "",
      attending: s.data?.attending || "",
      companions: s.data?.companions || "",
      future_interest: s.data?.future_interest || "",
      future_locations: s.data?.future_locations || "",
      consent: s.data?.consent || "",
    }));

    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(simplified) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
}
