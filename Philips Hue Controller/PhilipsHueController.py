from phue import Bridge
import time, playsound
class PhilipsHueController:
	def cinemaFadeDown(self):
		playsound.playsound("PATHTOFILE")
		print("dimming down lights")
		self.bridge.set_group(12, "bri", 0, transitiontime=100)
		time.sleep(7)
		print("turning off lights")
		self.bridge.set_group(12, "on", False)


	def __init__(self):	
		self.bridge = Bridge("YOURIP")
		self.bridge.connect()
		self.bridge.get_api()
		self.cinemaFadeDown()

PhilipsHueController()