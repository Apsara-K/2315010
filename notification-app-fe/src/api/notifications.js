//code to fetch notifications from the backend API
export async function fetchNotifications() 
{
  try 
  {
    const response = await fetch("/api/notifications");
    if (!response.ok)
    {
      throw new Error("Failed to fetch the notifications");
    }
    const data = await response.json();
    return data;
  } 
  catch (error) 
  {
    console.error("Error to fetch the notifications:", error);
    return{
         notifications: [] 
    };
  }
}

