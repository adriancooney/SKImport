//
//  SKPhysicsBody+SKPhysicsBodyImport.m
//  SKImport
//
//  Created by Adrian Cooney on 26/05/2014.
//  Copyright (c) 2014 Adrian Cooney. All rights reserved.
//

#import "SKPhysicsBody+SKPhysicsBodyImport.h"

@implementation SKPhysicsBody (SKPhysicsBodyImport)
/**
 * Generate a physics body from an JSON of file
 * containing { "bodies": [[[x, y], [x1, y1], ...], ...] }
 * @param {NSString *} file The filename,
 * @return {SKPhysicsBody}
 */
+(SKPhysicsBody *) bodyWithFile: (NSString *) file {
    NSMutableArray *bodies = [[NSMutableArray alloc] init];
    NSDictionary *data = (NSDictionary *)[SKPhysicsBody getJSONData:file];
    [((NSArray *)[data objectForKey:@"bodies"]) enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        [bodies addObject:[SKPhysicsBody createBody:(NSArray *)obj]];
    }];
    
    return [SKPhysicsBody bodyWithBodies:bodies];
}

/**
 * Read and parse a JSON file.
 * @param {NSString *} file The path to the file.
 * @return {id} The parsed JSON object.
 */
+(id) getJSONData: (NSString *) file {
    if(file == NULL) [NSException raise:@"NULL_FILE" format:@"File path for JSON file is NULL."];
    
    NSData *data = [NSData dataWithContentsOfFile:file];
    NSError *error = nil;
    
    // Parse the JSON
    id json = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&error];
    
    // Handle JSON file errors
    if(error)
        [NSException raise:[error localizedDescription] format: nil];
    
    return json;
}

/**
 * Verify an exported JSON file.
 * @param {id} json The parsed JSON file.
 * @return {BOOL} Valid/invalid
 *
 * Incredibly simple verification method. If it has the property
 * "bodies", it's good to go. I'm afraid to dig deeper in this
 * because in short, I have no idea how to handle errors with
 * this. Does I pass in an &error into the [SKPhysicsBody bodyWithFile]
 * or do I raise an exception?
 */
+(BOOL) verifyJSONFile: (id) json {
    NSDictionary *data = (NSDictionary *)json;
    NSArray *bodies = [data objectForKey:@"bodies"];
    
    return bodies != NULL;
}

/**
 * Create a physics body from an import body
 * @param {NSArray *} body An array of @[x, y] points.
 * @return {SKPhysicsBody *}
 */
+(SKPhysicsBody *) createBody: (NSArray *) body {
    UIBezierPath *path = [SKPhysicsBody generatePathFromArrayOfPoint:body];
    
    return [SKPhysicsBody bodyWithPolygonFromPath:path.CGPath];
}

/**
 * Generate a UIBezierPath from an array of points.
 * @param {NSArray *} points The array of @[x, y] points.
 * @return {UIBezierPath *}
 */
+(UIBezierPath *) generatePathFromArrayOfPoint: (NSArray *) points {
    UIBezierPath *path = UIBezierPath.bezierPath;
    
    [points enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
            NSArray *point = (NSArray *)obj;
            NSNumber *x = [point objectAtIndex:0];
            NSNumber *y = [point objectAtIndex:1];
            CGPoint p = CGPointMake([x floatValue], [y floatValue]);
        
            if(idx == 0)
                [path moveToPoint:p];
            else
                [path addLineToPoint:p];
    }];
    
    [path closePath];
    
    return path;
}
@end
