require 'rubygems'
require 'pushmeup'
GCM.host = 'https://android.googleapis.com/gcm/send'
GCM.format = :json
GCM.key = "AIzaSyAG-Nk9B7wRlC8_fovYkV58StvJ57Ucex8"
destination = ["APA91bGcmoByVuS7pc2gtEAbEQhrB3U_J8YK2Qez1wMCBhgHwEi2_K99Iz0da55Y8cQuZ0sy55lXv4bo8KD3t_MzTB357x_xw6iRgeNHTEmE0abTB9bXBlzqp7b_bv44jcvhwGyhm-cMc8pnCamjUW3J8i8r3G-aJA"]
data = {:message => "PhoneGap Build rocks!", :msgcnt => "1", :soundname => "beep.wav"}

GCM.send_notification( destination, data)
