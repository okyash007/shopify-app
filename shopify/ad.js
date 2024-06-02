export async function getad(tailboost_app_id, user_agent) {
  console.log(
    `${process.env.TAILBOOST_URL}/adRequest/?tailboost_app_id=${tailboost_app_id}&tailboost_user_id=tailboost_user_34f10379-d31c-4&user_agent=${user_agent}`
  );
  const response = await fetch(
    `${process.env.TAILBOOST_URL}/adRequest/?tailboost_app_id=${tailboost_app_id}&tailboost_user_id=tailboost_user_34f10379-d31c-4&user_agent=${user_agent}`,
    {
      headers: {
        Accept: "text/html",
      },
    }
  );

  const htmlContent = await response.text();

  return htmlContent;
}
