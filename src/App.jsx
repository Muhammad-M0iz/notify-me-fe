const signInAndCreateTarget = async () => {
  try {
    // Create guest user with email & password
    const user = await account.create(ID.unique(), email, password);
    console.log("User created:", user);

    // Log in the user
    await account.createEmailPasswordSession(email, password);
    console.log("User logged in");

    // Get FCM token
    const token = await generateToken();
    console.log("FCM token:", token);

    // First, list and delete existing targets
    try {
      const targets = await account.listTargets();
      await Promise.all(
        targets.targets.map(target => 
          account.deleteTarget(target.$id)
        )
      );
    } catch (e) {
      console.log("No existing targets to delete");
    }

    // Wait a small amount of time to ensure deletion is processed
    await new Promise(resolve => setTimeout(resolve, 500));

    // Register push target
    const result = await account.createPushTarget(
      ID.unique(), 
      token,
    );
    if(result) console.log("Push target registered", result); 

  } catch (error) {
    console.error("Error:", error);
  }
};