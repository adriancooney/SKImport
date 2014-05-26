//
//  SKPhysicsBody+SKPhysicsBodyImport.h
//  SKImport
//
//  Created by Adrian Cooney on 26/05/2014.
//  Copyright (c) 2014 Adrian Cooney. All rights reserved.
//
#import <SpriteKit/SpriteKit.h>

@interface SKPhysicsBody (SKPhysicsBodyImport)
+(SKPhysicsBody *) bodyWithFile: (NSString *) file;
+(id) getJSONData: (NSString *) file;
+(BOOL) verifyJSONFile: (id) data;
+(SKPhysicsBody *) createBody: (NSArray *) body;
+(UIBezierPath *) generatePathFromArrayOfPoint: (NSArray *) points;
@end
